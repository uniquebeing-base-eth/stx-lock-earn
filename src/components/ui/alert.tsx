import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative w-full rounded-xl border p-4 shadow-sm",
    "transition-all duration-300 ease-out",

    "[&>svg~*]:pl-8",
    "[&>svg+div]:translate-y-[-2px]",

    "[&>svg]:absolute",
    "[&>svg]:left-4",
    "[&>svg]:top-4",
    "[&>svg]:h-4",
    "[&>svg]:w-4",
    "[&>svg]:text-foreground",

    "hover:shadow-md",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-border/50",
          "bg-background",
          "text-foreground",
          "hover:border-border",
        ].join(" "),

        destructive: [
          "border-destructive/40",
          "bg-destructive/5",
          "text-destructive",
          "shadow-destructive/5",
          "dark:border-destructive/60",
          "[&>svg]:text-destructive",
        ].join(" "),
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1.5 font-semibold leading-none tracking-tight",
      "text-foreground",
      className
    )}
    {...props}
  />
));

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm leading-relaxed text-muted-foreground",
      "[&_p]:leading-relaxed",
      "[&_a]:font-medium [&_a]:underline-offset-4 hover:[&_a]:underline",
      className
    )}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
