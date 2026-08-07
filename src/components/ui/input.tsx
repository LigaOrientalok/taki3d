import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder:text-zinc-500 transition-colors outline-none",
        "focus:border-brand-blue/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-brand-blue/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
