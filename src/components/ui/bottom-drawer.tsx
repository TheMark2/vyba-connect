
import React, { forwardRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerPortal,
  DrawerOverlay,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface BottomDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  showOverlay?: boolean;
}

const BottomDrawer = forwardRef<HTMLDivElement, BottomDrawerProps>(
  ({ 
    open, 
    onOpenChange, 
    children, 
    className, 
    showOverlay = true
  }, ref) => {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground={false}
      >
        {showOverlay && <DrawerOverlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />}
        <DrawerPortal>
          <DrawerContent className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-[24px] border-t border-border",
            className
          )}>
            <div ref={ref} className="h-full w-full">
              {children}
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    );
  }
);

BottomDrawer.displayName = "BottomDrawer";

export { BottomDrawer };
