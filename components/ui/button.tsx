import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "default" | "outline" | "ghost"
}

const Button = React.forwardRef<
  React.ElementRef<"button">,
  ButtonProps
>(({ className, variant = "default", ...props }, ref) => {
  let variantClasses = ""
  switch (variant) {
    case "outline":
      variantClasses = "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
      break
    case "ghost":
      variantClasses = "bg-transparent hover:bg-accent hover:text-accent-foreground"
      break
    default:
      variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"
  }
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        variantClasses,
        className!
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
