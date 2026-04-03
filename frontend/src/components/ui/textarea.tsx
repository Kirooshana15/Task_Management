import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm shadow-[inset_0_2px_4px_hsla(0,0%,0%,0.05),0_1px_0_hsla(0,0%,100%,0.8)] dark:shadow-[inset_0_2px_4px_hsla(0,0%,0%,0.4),0_1px_0_hsla(0,0%,100%,0.05)] ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
