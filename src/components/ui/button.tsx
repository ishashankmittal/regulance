"use client";

import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6d52]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm",
  {
    variants: {
      variant: {
        default:
          "bg-[#1a6d52] text-white hover:bg-[#238c6a] rounded-lg",
        white:
          "bg-zinc-100 text-zinc-950 hover:bg-white rounded-lg",
        ghost:
          "border border-[#1e1e22] text-zinc-400 hover:border-[#2a2a2e] hover:text-zinc-200 rounded-lg",
        secondary:
          "bg-[#141418] text-zinc-300 hover:bg-[#1e1e22] rounded-lg",
        link: "text-zinc-500 hover:text-zinc-200 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
