import { cn } from "@/lib/utils";

type LogoVariant = "horizontal" | "square" | "isotipo";
type LogoTheme = "dark" | "light";

interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  className?: string;
}

const cubeFaces: Record<LogoTheme, { top: string; right: string; left: string }> = {
  dark: { top: "#7cc4ff", right: "#28A9FF", left: "#0f6cb3" },
  light: { top: "#e8f4ff", right: "#ffffff", left: "#c6ccd6" },
};

function Cube({
  theme,
  size = 28,
  className,
}: {
  theme: LogoTheme;
  size?: number;
  className?: string;
}) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="-28 -30 56 60"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path d="M 0,-28 L 24,-14 L 0,0 L -24,-14 Z" fill={cubeFaces[theme].top} />
      <path d="M 24,-14 L 0,0 L 0,28 L 24,14 Z" fill={cubeFaces[theme].right} />
      <path d="M -24,-14 L 0,0 L 0,28 L -24,14 Z" fill={cubeFaces[theme].left} />
      <path
        d="M 0,-28 L 24,-14 L 0,0 L -24,-14 Z"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
    </svg>
  );
}

export function Logo({ variant = "horizontal", theme = "dark", className }: LogoProps) {
  const textColor = theme === "dark" ? "#FFFFFF" : "#0E0E10";
  const brand = "Space Grotesk, Inter, Arial, sans-serif";

  if (variant === "isotipo") {
    return <Cube theme={theme} size={36} className={className} />;
  }

  if (variant === "square") {
    return (
      <svg
        viewBox="0 0 120 104"
        className={cn("h-16 w-auto", className)}
        role="img"
        aria-label="TAKI3D"
      >
        <g transform="translate(60,34) scale(1.05)">
          <path d="M 0,-28 L 24,-14 L 0,0 L -24,-14 Z" fill={cubeFaces[theme].top} />
          <path d="M 24,-14 L 0,0 L 0,28 L 24,14 Z" fill={cubeFaces[theme].right} />
          <path d="M -24,-14 L 0,0 L 0,28 L -24,14 Z" fill={cubeFaces[theme].left} />
        </g>
        <text
          x="60"
          y="88"
          textAnchor="middle"
          fontFamily={brand}
          fontWeight="700"
          fontSize="26"
          fill={textColor}
        >
          TAKI
          <tspan fill="#28A9FF">3D</tspan>
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 180 48"
      className={cn("h-9 w-auto", className)}
      role="img"
      aria-label="TAKI3D"
    >
      <g transform="translate(26,24) scale(1.05)">
        <path d="M 0,-28 L 24,-14 L 0,0 L -24,-14 Z" fill={cubeFaces[theme].top} />
        <path d="M 24,-14 L 0,0 L 0,28 L 24,14 Z" fill={cubeFaces[theme].right} />
        <path d="M -24,-14 L 0,0 L 0,28 L -24,14 Z" fill={cubeFaces[theme].left} />
      </g>
      <text
        x="58"
        y="32"
        fontFamily={brand}
        fontWeight="700"
        fontSize="22"
        letterSpacing="1"
        fill={textColor}
      >
        TAKI
        <tspan fill="#28A9FF">3D</tspan>
      </text>
    </svg>
  );
}

export default Logo;
