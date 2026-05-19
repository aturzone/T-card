/**
 * Statue3DStatic — silhouette of the classical bust + plinth. Shown as the
 * Suspense fallback while the 2.6 MB GLB streams. Shape roughly matches
 * the rendered Statue3D's resting pose: tall narrow head, neck taper,
 * sloping shoulders, cylindrical museum plinth below.
 */
export default function Statue3DStatic({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 320"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        color: 'color-mix(in srgb, var(--ink) 14%, transparent)',
      }}
    >
      {/* Plinth (cylinder, viewed roughly head-on) */}
      <ellipse cx="100" cy="280" rx="50" ry="6" fill="currentColor" />
      <path
        d="M50 280v14a50 6 0 0 0 100 0V280"
        fill="currentColor"
      />
      <ellipse cx="100" cy="294" rx="50" ry="6" fill="currentColor" opacity="0.5" />

      {/* Chest / shoulders — sloping classical bust truncation */}
      <path
        d="M55 270 Q60 210 80 188 L120 188 Q140 210 145 270 Z"
        fill="currentColor"
      />

      {/* Neck */}
      <path d="M85 188 L88 150 L112 150 L115 188 Z" fill="currentColor" />

      {/* Head — tall narrow proportions, slight forward lean */}
      <path
        d="M100 36
           C 78 36 66 56 66 84
           C 66 102 70 116 78 128
           C 82 140 86 148 88 150
           L 112 150
           C 114 148 118 140 122 128
           C 130 116 134 102 134 84
           C 134 56 122 36 100 36 Z"
        fill="currentColor"
      />
    </svg>
  );
}
