export default function PrinterIllustration() {
  return (
    <svg
      viewBox="0 0 460 540"
      className="h-auto w-full"
      role="img"
      aria-label="Impresora 3D moderna imprimiendo una figura"
    >
      <defs>
        <radialGradient id="pr-bg" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#28A9FF" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#28A9FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pr-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#222328" />
          <stop offset="100%" stopColor="#141418" />
        </linearGradient>
        <linearGradient id="pr-body2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b1c21" />
          <stop offset="100%" stopColor="#101013" />
        </linearGradient>
        <linearGradient id="pr-plate" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#26272e" />
          <stop offset="50%" stopColor="#3a3b44" />
          <stop offset="100%" stopColor="#26272e" />
        </linearGradient>
        <linearGradient id="pr-figure" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7cc4ff" />
          <stop offset="100%" stopColor="#28A9FF" />
        </linearGradient>
        <linearGradient id="pr-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
        </linearGradient>
        <radialGradient id="pr-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* backdrop */}
      <circle cx="230" cy="270" r="240" fill="url(#pr-bg)" />
      <ellipse cx="230" cy="504" rx="210" ry="30" fill="url(#pr-floor)" />

      {/* floating decorations */}
      <g opacity="0.5">
        <circle cx="82" cy="150" r="5" fill="#28A9FF" />
        <circle cx="382" cy="180" r="3" fill="#4CFF84" />
        <circle cx="404" cy="360" r="4" fill="#28A9FF" />
        <circle cx="58" cy="330" r="3" fill="#ffffff" />
      </g>
      <g transform="translate(378,140)" opacity="0.7">
        <circle r="13" fill="none" stroke="#28A9FF" strokeWidth="1.5" opacity="0.5" />
        <circle r="5" fill="#28A9FF" />
      </g>
      <g transform="translate(70,415)" opacity="0.7">
        <path d="M 0,-13 L 9,-6.5 L 9,6.5 L 0,13 L -9,6.5 L -9,-6.5 Z" fill="#1b1c20" stroke="#28A9FF" strokeWidth="1.5" />
        <circle r="4" fill="#28A9FF" />
      </g>

      {/* body */}
      <rect x="45" y="56" width="370" height="430" rx="36" fill="url(#pr-body)" stroke="rgba(255,255,255,0.07)" />
      <rect x="45" y="50" width="370" height="22" rx="11" fill="#242529" stroke="rgba(255,255,255,0.06)" />

      {/* interior */}
      <rect x="66" y="98" width="328" height="296" rx="20" fill="#15161a" stroke="rgba(255,255,255,0.08)" />
      {/* z rails */}
      <rect x="80" y="112" width="14" height="270" rx="7" fill="#0d0d10" />
      <rect x="366" y="112" width="14" height="270" rx="7" fill="#0d0d10" />

      {/* build plate */}
      <rect x="104" y="338" width="252" height="14" rx="7" fill="url(#pr-plate)" stroke="rgba(255,255,255,0.12)" />
      <g stroke="rgba(255,255,255,0.12)" strokeWidth="1">
        <line x1="120" y1="340" x2="120" y2="350" />
        <line x1="160" y1="340" x2="160" y2="350" />
        <line x1="200" y1="340" x2="200" y2="350" />
        <line x1="240" y1="340" x2="240" y2="350" />
        <line x1="280" y1="340" x2="280" y2="350" />
        <line x1="320" y1="340" x2="320" y2="350" />
        <line x1="116" y1="343" x2="344" y2="343" />
        <line x1="116" y1="347" x2="344" y2="347" />
      </g>

      {/* printed figure */}
      <g>
        <rect x="228" y="262" width="24" height="76" rx="10" fill="url(#pr-figure)" />
        <rect x="214" y="276" width="10" height="30" rx="5" fill="url(#pr-figure)" opacity="0.85" />
        <rect x="256" y="276" width="10" height="30" rx="5" fill="url(#pr-figure)" opacity="0.85" />
        <rect x="231" y="240" width="18" height="24" rx="8" fill="url(#pr-figure)" />
        <circle cx="236" cy="250" r="2" fill="#0E0E10" />
        <circle cx="244" cy="250" r="2" fill="#0E0E10" />
        <rect x="232" y="328" width="10" height="10" rx="3" fill="#1a6fb8" />
        <rect x="238" y="328" width="10" height="10" rx="3" fill="#1a6fb8" />
        <line x1="240" y1="338" x2="240" y2="340" stroke="#7cc4ff" strokeWidth="3" />
      </g>

      {/* filament */}
      <line x1="240" y1="170" x2="240" y2="238" stroke="#28A9FF" strokeWidth="6" opacity="0.18" strokeLinecap="round" />
      <line x1="240" y1="170" x2="240" y2="238" stroke="#7cc4ff" strokeWidth="2.5" strokeLinecap="round" />

      {/* gantry */}
      <rect x="92" y="118" width="276" height="12" rx="6" fill="#26272e" stroke="rgba(255,255,255,0.06)" />

      {/* print head */}
      <g>
        <rect x="222" y="114" width="36" height="28" rx="7" fill="#2c2d34" stroke="rgba(255,255,255,0.08)" />
        <circle cx="240" cy="122" r="2.5" fill="#28A9FF" />
        <rect x="231" y="142" width="18" height="22" rx="4" fill="#33343c" />
        <path d="M 234 164 L 246 164 L 240 172 Z" fill="#9aa0ab" />
      </g>

      {/* glass */}
      <rect x="66" y="98" width="328" height="296" rx="20" fill="url(#pr-glass)" />
      <g stroke="rgba(255,255,255,0.07)" strokeWidth="10">
        <line x1="92" y1="116" x2="150" y2="372" />
        <line x1="138" y1="116" x2="196" y2="372" />
      </g>

      {/* base + screen + spool */}
      <rect x="45" y="394" width="370" height="92" rx="28" fill="url(#pr-body2)" stroke="rgba(255,255,255,0.06)" />
      <rect x="286" y="424" width="86" height="36" rx="8" fill="#0b0b0e" stroke="rgba(255,255,255,0.1)" />
      <line x1="300" y1="438" x2="358" y2="438" stroke="#28A9FF" strokeWidth="4" strokeLinecap="round" />
      <line x1="300" y1="447" x2="338" y2="447" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <g transform="translate(120,442)">
        <circle r="26" fill="#222329" stroke="rgba(255,255,255,0.08)" />
        <circle r="10" fill="#0e0e10" />
        <line x1="-26" y1="0" x2="-10" y2="0" stroke="#2f3138" strokeWidth="4" />
        <line x1="10" y1="0" x2="26" y2="0" stroke="#2f3138" strokeWidth="4" />
        <line x1="0" y1="-26" x2="0" y2="-10" stroke="#2f3138" strokeWidth="4" />
        <line x1="0" y1="10" x2="0" y2="26" stroke="#2f3138" strokeWidth="4" />
      </g>
      <circle cx="240" cy="450" r="3" fill="#4CFF84" />
      <circle cx="240" cy="450" r="6" fill="#4CFF84" opacity="0.25" />

      {/* feet */}
      <rect x="72" y="486" width="58" height="10" rx="5" fill="#0c0c0f" />
      <rect x="330" y="486" width="58" height="10" rx="5" fill="#0c0c0f" />
    </svg>
  );
}
