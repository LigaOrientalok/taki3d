import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-28 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-500 transition-colors outline-none resize-none",
      "focus:border-brand-blue/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-brand-blue/20",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
