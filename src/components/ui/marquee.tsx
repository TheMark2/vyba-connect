
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
 
interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  children: React.ReactNode;
  maxWidth?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  gap?: string;
}
 
export function Marquee({
  className,
  children,
  maxWidth = 200,
  pauseOnHover,
  reverse,
  gap,
  ...props
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      const contentWidth = contentRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      setContentWidth(contentWidth);
      setAnimate(contentWidth > containerWidth);
    }
  }, [children]);

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn(
        "group overflow-hidden whitespace-nowrap",
        className
      )}
      style={{ 
        maxWidth: `${maxWidth}px`, 
        overflow: 'hidden' 
      }}
    >
      <div 
        ref={contentRef}
        className={cn(
          "inline-block transition-transform",
          animate && "animate-marquee",
          pauseOnHover && animate && "group-hover:pause-animation"
        )}
        style={{
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {children}
      </div>
    </div>
  );
}
