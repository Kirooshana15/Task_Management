import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-[inset_0_1px_0_hsla(0,0%,100%,0.2),0_2px_6px_hsla(217,40%,19%,0.2)] hover:shadow-[inset_0_1px_0_hsla(0,0%,100%,0.2),0_8px_20px_-4px_hsla(217,40%,19%,0.4)] hover:-translate-y-[1px]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[inset_0_1px_0_hsla(0,0%,100%,0.2),0_2px_4px_hsla(0,0%,0%,0.1)] hover:shadow-[0_6px_15px_-4px_hsla(var(--destructive),0.4)] hover:-translate-y-[1px]",
        outline: "border border-border/50 bg-background/50 backdrop-blur-md hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-[0_8px_20px_-4px_hsla(0,0%,0%,0.08)] hover:-translate-y-[1px]",
        secondary: "bg-secondary/50 backdrop-blur-md border border-border/30 text-secondary-foreground hover:bg-secondary/80 shadow-[inset_0_1px_0_hsla(0,0%,100%,0.2),0_2px_4px_hsla(0,0%,0%,0.05)] hover:shadow-[0_6px_12px_-4px_hsla(0,0%,0%,0.1)] hover:-translate-y-[1px]",
        ghost: "hover:bg-accent/40 hover:text-accent-foreground hover:shadow-sm active:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
