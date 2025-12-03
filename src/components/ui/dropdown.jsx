import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils" // Đảm bảo bạn có file utils này

// --- DropdownMenuItem ---
const dropdownItemVariants = cva(
  "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        destructive: "text-destructive hover:bg-destructive hover:text-white focus:bg-destructive focus:text-white",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground",
      },
      size: {
        default: "px-2 py-1.5",
        sm: "px-1.5 py-1 text-xs",
        lg: "px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function DropdownMenuItem({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="dropdown-item"
      className={cn(dropdownItemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// --- DropdownTrigger ---
const dropdownTriggerVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
)

const DropdownTrigger = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(dropdownTriggerVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  )
})
DropdownTrigger.displayName = "DropdownTrigger"

// --- DropdownContent ---
const DropdownContent = React.forwardRef(({ className, align = "start", sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  />
))
DropdownContent.displayName = "DropdownContent"

// --- DropdownSeparator ---
const DropdownSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownSeparator.displayName = "DropdownSeparator"

// --- DropdownLabel ---
const DropdownLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-muted-foreground", className)}
    {...props}
  />
))
DropdownLabel.displayName = "DropdownLabel"

// --- Main Dropdown Component ---
const Dropdown = ({ children, defaultOpen = false, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const setOpen = (open) => {
    if (!isControlled) {
      setInternalOpen(open)
    }
    onOpenChange?.(open)
  }

  const dropdownRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen]) // Bỏ setOpen khỏi deps để tránh loop

  return (
    <div ref={dropdownRef} className="relative inline-block text-left w-full ">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Xử lý Trigger
          if (child.type === DropdownTrigger) {
            return React.cloneElement(child, {
              ...child.props,
              onClick: (e) => {
                setOpen(!isOpen)
                child.props.onClick?.(e)
              },
            })
          }
          // Xử lý Content
          if (child.type === DropdownContent) {
            const align = child.props.align || "start";
            let alignClass = "left-0 origin-top-left";

            if (align === "end") {
              alignClass = "right-0 origin-top-right";
            } else if (align === "center") {
              alignClass = "left-1/2 -translate-x-1/2 origin-top";
            }
            return isOpen ? (
              <div className={`absolute mt-2 z-50 ${alignClass}`}>
                {React.cloneElement(child, {
                  ...child.props,
                  children: React.Children.map(child.props.children, (contentChild) => {
                    // Xử lý click vào Item thì đóng menu
                    if (React.isValidElement(contentChild) && contentChild.type === DropdownMenuItem) {
                      return React.cloneElement(contentChild, {
                        ...contentChild.props,
                        onClick: (e) => {
                          contentChild.props.onClick?.(e)
                          setOpen(false)
                        },
                      })
                    }
                    return contentChild
                  }),
                })}
              </div>
            ) : null
          }
        }
        return child
      })}
    </div>
  )
}

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownMenuItem,
  DropdownSeparator,
  DropdownLabel,
  dropdownItemVariants,
  dropdownTriggerVariants,
}