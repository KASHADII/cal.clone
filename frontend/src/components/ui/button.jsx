import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = (variant, size, className) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  let variantClasses = ""
  if (variant === "default") variantClasses = "bg-primary text-primary-foreground shadow hover:bg-primary/90"
  else if (variant === "destructive") variantClasses = "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
  else if (variant === "outline") variantClasses = "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
  else if (variant === "secondary") variantClasses = "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
  else if (variant === "ghost") variantClasses = "hover:bg-accent hover:text-accent-foreground"
  else if (variant === "link") variantClasses = "text-primary underline-offset-4 hover:underline"
  else variantClasses = "bg-primary text-primary-foreground shadow hover:bg-primary/90"

  let sizeClasses = ""
  if (size === "default") sizeClasses = "h-9 px-4 py-2"
  else if (size === "sm") sizeClasses = "h-8 rounded-md px-3 text-xs"
  else if (size === "lg") sizeClasses = "h-10 rounded-md px-8"
  else if (size === "icon") sizeClasses = "h-9 w-9"
  else sizeClasses = "h-9 px-4 py-2"

  return cn(base, variantClasses, sizeClasses, className)
}

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={buttonVariants(variant, size, className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
