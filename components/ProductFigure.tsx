import type { ReactElement } from "react";

export type FigureVariant =
  | "robot"
  | "dragon"
  | "samurai"
  | "mage"
  | "astronaut"
  | "monster";

export default function ProductFigure({
  variant,
  className = "",
}: {
  variant: FigureVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label={`Figura ${variant}`}
    >
      <defs>
        <linearGradient id={`pf-${variant}-a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradients[variant][0]} />
          <stop offset="100%" stopColor={gradients[variant][1]} />
        </linearGradient>
        <linearGradient id={`pf-${variant}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradients[variant][2]} />
          <stop offset="100%" stopColor={gradients[variant][3]} />
        </linearGradient>
        <radialGradient id={`pf-${variant}-glow`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={glowColors[variant]} stopOpacity="0.9" />
          <stop offset="100%" stopColor={glowColors[variant]} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="120" cy="110" r="90" fill={`url(#pf-${variant}-glow)`} />
      <ellipse cx="120" cy="214" rx="80" ry="14" fill="rgba(255,255,255,0.05)" />
      <ellipse cx="120" cy="210" rx="48" ry="9" fill={glowColors[variant]} opacity="0.7" />
      <ellipse cx="120" cy="208" rx="42" ry="7" fill={baseColors[variant]} />

      {figures[variant]}
    </svg>
  );
}

const gradients: Record<FigureVariant, [string, string, string, string]> = {
  robot: ["#a78bfa", "#6d28d9", "#c4b5fd", "#7c3aed"],
  dragon: ["#34d399", "#059669", "#a7f3d0", "#10b981"],
  samurai: ["#fb923c", "#dc2626", "#fdba74", "#ef4444"],
  mage: ["#c084fc", "#a21caf", "#e9d5ff", "#c026d3"],
  astronaut: ["#38bdf8", "#2563eb", "#bae6fd", "#3b82f6"],
  monster: ["#f472b6", "#db2777", "#fbcfe8", "#ec4899"],
};

const glowColors: Record<FigureVariant, string> = {
  robot: "#8b5cf6",
  dragon: "#10b981",
  samurai: "#f97316",
  mage: "#d946ef",
  astronaut: "#0ea5e9",
  monster: "#ec4899",
};

const baseColors: Record<FigureVariant, string> = {
  robot: "#4c1d95",
  dragon: "#064e3b",
  samurai: "#7c2d12",
  mage: "#701a75",
  astronaut: "#1e3a8a",
  monster: "#831843",
};

const figures: Record<FigureVariant, ReactElement> = {
  robot: (
    <g>
      <line x1="120" y1="44" x2="120" y2="30" stroke="#8b5cf6" strokeWidth="3" />
      <circle cx="120" cy="26" r="4.5" fill="#22d3ee" opacity="0.9" />
      <rect x="84" y="50" width="72" height="56" rx="16" fill={`url(#pf-robot-a)`} />
      <rect x="96" y="62" width="48" height="22" rx="11" fill="#0b0d15" opacity="0.55" />
      <circle cx="107" cy="70" r="4" fill="#22d3ee" />
      <circle cx="133" cy="70" r="4" fill="#22d3ee" />
      <line x1="112" y1="94" x2="128" y2="94" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
      <rect x="76" y="114" width="15" height="42" rx="7" fill={`url(#pf-robot-a)`} />
      <rect x="149" y="114" width="15" height="42" rx="7" fill={`url(#pf-robot-a)`} />
      <circle cx="83" cy="158" r="5" fill="#22d3ee" opacity="0.8" />
      <circle cx="157" cy="158" r="5" fill="#22d3ee" opacity="0.8" />
      <rect x="92" y="110" width="56" height="60" rx="12" fill={`url(#pf-robot-b)`} />
      <circle cx="120" cy="138" r="9" fill="#0b0d15" />
      <circle cx="120" cy="138" r="5" fill="#22d3ee" />
      <rect x="100" y="170" width="15" height="28" rx="7" fill={`url(#pf-robot-a)`} />
      <rect x="125" y="170" width="15" height="28" rx="7" fill={`url(#pf-robot-a)`} />
      <rect x="97" y="196" width="20" height="8" rx="4" fill="#0b0d15" opacity="0.5" />
      <rect x="123" y="196" width="20" height="8" rx="4" fill="#0b0d15" opacity="0.5" />
    </g>
  ),
  dragon: (
    <g>
      <path d="M78 96 L34 66 L74 122 L26 148 L92 134 Z" fill={`url(#pf-dragon-a)`} opacity="0.6" />
      <path d="M162 96 L206 66 L166 122 L214 148 L148 134 Z" fill={`url(#pf-dragon-a)`} opacity="0.6" />
      <path d="M90 48 L80 20 L106 40 Z" fill={`url(#pf-dragon-a)`} />
      <path d="M150 48 L160 20 L134 40 Z" fill={`url(#pf-dragon-a)`} />
      <path d="M78 66 Q78 46 120 46 Q162 46 162 66 L166 86 L120 102 L74 86 Z" fill={`url(#pf-dragon-b)`} />
      <path d="M96 52 Q120 44 144 52 L138 62 L102 62 Z" fill="#0b0d15" opacity="0.4" />
      <polygon points="104,66 116,58 128,66 116,72" fill="#6ee7b7" />
      <polygon points="84,84 96,80 92,92" fill="#0b0d15" opacity="0.5" />
      <polygon points="156,84 144,80 148,92" fill="#0b0d15" opacity="0.5" />
      <path d="M92 84 L120 96 L148 84 L120 112 Z" fill={`url(#pf-dragon-a)`} />
      <path d="M100 110 L140 110 L150 152 L90 152 Z" fill={`url(#pf-dragon-b)`} />
      <path d="M96 120 Q120 130 144 120 L148 152 L92 152 Z" fill="#a7f3d0" opacity="0.25" />
    </g>
  ),
  samurai: (
    <g>
      <path d="M86 98 Q86 58 120 58 Q154 58 154 98 L150 106 L120 100 L90 106 Z" fill={`url(#pf-samurai-a)`} />
      <path d="M120 58 L132 36 L136 54 Z" fill={`url(#pf-samurai-b)`} />
      <path d="M120 40 L124 30 L128 40 Z" fill="#fde047" opacity="0.8" />
      <rect x="96" y="96" width="48" height="18" rx="6" fill="#1c1917" />
      <rect x="104" y="102" width="32" height="5" rx="2.5" fill="#fde047" />
      <path d="M74 122 Q120 110 166 122 L158 140 L120 128 L82 140 Z" fill={`url(#pf-samurai-a)`} />
      <path d="M94 140 L146 140 L138 172 L102 172 Z" fill={`url(#pf-samurai-b)`} />
      <line x1="120" y1="146" x2="120" y2="168" stroke="#fde047" strokeWidth="3" opacity="0.7" />
      <line x1="172" y1="120" x2="150" y2="178" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <line x1="162" y1="138" x2="158" y2="146" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  mage: (
    <g>
      <path d="M84 132 Q80 74 120 74 Q160 74 156 132 L150 150 L120 142 L90 150 Z" fill={`url(#pf-mage-a)`} />
      <path d="M98 122 Q120 96 142 122 L138 148 L102 148 Z" fill="#2e1065" opacity="0.7" />
      <circle cx="110" cy="120" r="3" fill="#f0abfc" />
      <circle cx="130" cy="120" r="3" fill="#f0abfc" />
      <path d="M92 148 L148 148 L160 192 L80 192 Z" fill={`url(#pf-mage-b)`} />
      <path d="M120 148 L120 192" stroke="#0b0d15" strokeWidth="3" opacity="0.4" />
      <line x1="170" y1="116" x2="152" y2="186" stroke="#a21caf" strokeWidth="5" strokeLinecap="round" />
      <circle cx="171" cy="112" r="9" fill="#f0abfc" />
      <circle cx="171" cy="112" r="9" fill="#f0abfc" opacity="0.35" transform="scale(1.6) translate(-38,-25)" />
      <circle cx="168" cy="108" r="3" fill="#ffffff" opacity="0.8" />
    </g>
  ),
  astronaut: (
    <g>
      <rect x="100" y="102" width="40" height="56" rx="10" fill={`url(#pf-astronaut-a)`} />
      <circle cx="120" cy="74" r="30" fill="#e8f4fd" />
      <circle cx="120" cy="74" r="23" fill={`url(#pf-astronaut-b)`} />
      <ellipse cx="112" cy="64" rx="8" ry="5" fill="#ffffff" opacity="0.7" transform="rotate(-25 112 64)" />
      <rect x="88" y="118" width="18" height="40" rx="9" fill={`url(#pf-astronaut-a)`} />
      <rect x="134" y="118" width="18" height="40" rx="9" fill={`url(#pf-astronaut-a)`} />
      <rect x="80" y="108" width="12" height="30" rx="6" fill="#1e3a8a" />
      <rect x="148" y="108" width="12" height="30" rx="6" fill="#1e3a8a" />
      <rect x="104" y="156" width="12" height="26" rx="6" fill="#93c5fd" />
      <rect x="124" y="156" width="12" height="26" rx="6" fill="#93c5fd" />
      <circle cx="120" cy="126" r="6" fill="#bae6fd" />
      <line x1="120" y1="132" x2="120" y2="142" stroke="#bae6fd" strokeWidth="2" />
      <circle cx="120" cy="146" r="3" fill="#1e3a8a" opacity="0.8" />
    </g>
  ),
  monster: (
    <g>
      <path d="M120 74 L108 44 L128 58 Z" fill={`url(#pf-monster-a)`} />
      <path d="M120 74 L132 44 L112 58 Z" fill={`url(#pf-monster-a)`} />
      <path d="M70 116 Q70 68 120 68 Q170 68 170 116 Q170 166 120 166 Q70 166 70 116 Z" fill={`url(#pf-monster-b)`} />
      <circle cx="96" cy="112" r="12" fill="#ffffff" />
      <circle cx="144" cy="112" r="12" fill="#ffffff" />
      <circle cx="99" cy="115" r="5.5" fill="#be185d" />
      <circle cx="141" cy="115" r="5.5" fill="#be185d" />
      <circle cx="101" cy="113" r="2" fill="#ffffff" />
      <circle cx="143" cy="113" r="2" fill="#ffffff" />
      <path d="M104 142 Q120 154 136 142 L132 150 L120 156 L108 150 Z" fill="#831843" />
      <ellipse cx="90" cy="150" rx="12" ry="8" fill={`url(#pf-monster-a)`} />
      <ellipse cx="150" cy="150" rx="12" ry="8" fill={`url(#pf-monster-a)`} />
      <ellipse cx="90" cy="158" rx="8" ry="5" fill="#0b0d15" opacity="0.6" />
      <ellipse cx="150" cy="158" rx="8" ry="5" fill="#0b0d15" opacity="0.6" />
      <circle cx="76" cy="96" r="4" fill="#fbcfe8" opacity="0.8" />
      <circle cx="164" cy="96" r="4" fill="#fbcfe8" opacity="0.8" />
    </g>
  ),
};
