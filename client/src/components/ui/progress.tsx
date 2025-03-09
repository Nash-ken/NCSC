"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function getIndicatorColor(value: number) {
  if (value <= 25) {
    return "bg-red-500";  // Low progress (red)
  } else if (value <= 50) {
    return "bg-orange-500"; // Medium progress (orange)
  } else if (value <= 75) {
    return "bg-green-500";  // High progress (green)
  } else {
    return "bg-blue-500";   // Excellent progress (blue)
  }
}

function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={`${getIndicatorColor(value || 0)} h-full w-full flex-1 transition-all`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
