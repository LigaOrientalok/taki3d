import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-14 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-brand-blue">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-zinc-400">{description}</p>
      )}
    </Reveal>
  );
}
