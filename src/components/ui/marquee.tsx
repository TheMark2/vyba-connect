
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
 
interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  children: React.ReactNode;
  maxWidth?: number;
}
 
export function Marquee({
  className,
  children,
  maxWidth = 200,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group overflow-hidden text-ellipsis whitespace-nowrap",
        className
      )}
      style={{ 
        maxWidth: `${maxWidth}px`, 
        overflow: 'hidden' 
      }}
    >
      {children}
    </div>
  );
}
