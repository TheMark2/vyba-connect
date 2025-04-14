
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

function Skeleton({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted relative overflow-hidden", 
        isClient && "after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-[shimmer_1.5s_infinite]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Skeleton }
