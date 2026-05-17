/**
 * Statue3DStatic — minimal SVG silhouette of a classical bust (head + neck + chest).
 * Used as the Suspense fallback while the GLB streams and as the <768px replacement
 * for the full Three.js scene. Single path, no fill chrome, transparent background.
 */
export default function Statue3DStatic({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 260"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M100 18c-22 0-38 18-38 44 0 14 5 26 13 34-3 4-6 9-7 15-12 4-22 13-26 26-6 19-9 42-10 65 0 4 3 6 7 6h122c4 0 7-2 7-6-1-23-4-46-10-65-4-13-14-22-26-26-1-6-4-11-7-15 8-8 13-20 13-34 0-26-16-44-38-44z"
        fill="currentColor"
      />
    </svg>
  );
}
