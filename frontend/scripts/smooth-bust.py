"""
Subdivide + smooth-shade the bust GLB so the surface stops reading as
faceted paper. Output: bust_smooth.glb in the same models/ folder.

Run:
    blender --background --python frontend/scripts/smooth-bust.py
"""
import os
import sys

import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "models"))
# Use the Draco-decompressed copy because this Blender doesn't ship the
# KHR_draco_mesh_compression addon. Produced via:
#   npx @gltf-transform/cli dedup public/models/bust.glb /tmp/bust_dedup.glb
SRC = "/tmp/bust_dedup.glb"
DST = os.path.join(ROOT, "bust_smooth.glb")

SUBDIV_LEVELS = 2          # Catmull-Clark levels to add. 2 = ~16x triangles.
SMOOTH_ANGLE_DEG = 60.0    # Auto-smooth crease angle.
MERGE_DIST = 0.0001        # Weld near-duplicate vertices first.

# 1. Wipe the default scene.
bpy.ops.wm.read_factory_settings(use_empty=True)

# 2. Import the source GLB.
if not os.path.exists(SRC):
    sys.stderr.write(f"missing source: {SRC}\n")
    sys.exit(1)

bpy.ops.import_scene.gltf(filepath=SRC)

mesh_objects = [o for o in bpy.data.objects if o.type == "MESH"]
print(f"[smooth-bust] imported {len(mesh_objects)} mesh objects")

for obj in mesh_objects:
    print(f"[smooth-bust] processing {obj.name}: {len(obj.data.vertices)} verts -> ", end="")

    # Select + activate this object.
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    # Weld duplicate vertices so subdivision can interpolate across what
    # used to be hard-split face boundaries.
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=MERGE_DIST)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")

    # Apply auto smooth so the modifier respects sharp creases.
    if hasattr(obj.data, "use_auto_smooth"):
        obj.data.use_auto_smooth = True
        obj.data.auto_smooth_angle = SMOOTH_ANGLE_DEG * 3.14159265 / 180.0
    bpy.ops.object.shade_smooth()

    # Add + apply Subdivision Surface modifier (Catmull-Clark).
    mod = obj.modifiers.new(name="Subsurf", type="SUBSURF")
    mod.levels = SUBDIV_LEVELS
    mod.render_levels = SUBDIV_LEVELS
    mod.subdivision_type = "CATMULL_CLARK"
    bpy.ops.object.modifier_apply(modifier=mod.name)

    print(f"{len(obj.data.vertices)} verts")

# 3. Export to GLB (binary, Draco-compressed off for compatibility with the
# current loader).
bpy.ops.export_scene.gltf(
    filepath=DST,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
    export_normals=True,
)

print(f"[smooth-bust] wrote {DST}")
