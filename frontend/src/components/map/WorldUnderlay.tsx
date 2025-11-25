export function WorldUnderlay({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 500"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <g opacity="0.4" className="text-slate-600">
        {/* North America */}
        <path d="M150 60 L280 60 L320 150 L250 220 L180 200 L120 100 Z" fill="currentColor" />
        
        {/* South America */}
        <path d="M260 230 L340 230 L320 380 L270 450 L220 350 Z" fill="currentColor" />
        
        {/* Europe */}
        <path d="M460 70 L580 70 L550 140 L480 140 Z" fill="currentColor" />
        
        {/* Africa */}
        <path d="M470 150 L590 150 L610 250 L520 350 L450 250 Z" fill="currentColor" />
        
        {/* Asia */}
        <path d="M590 60 L850 60 L900 150 L800 250 L650 250 L600 150 Z" fill="currentColor" />
        
        {/* Australia */}
        <path d="M780 300 L900 300 L900 400 L780 400 Z" fill="currentColor" />
      </g>
    </svg>
  );
}
