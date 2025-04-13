
import React, { forwardRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerPortal,
  DrawerOverlay
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface BottomDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  showOverlay?: boolean;
  snapPoints?: number[];
  defaultSnapPoint?: number;
  closeThreshold?: number;
}

const BottomDrawer = forwardRef<HTMLDivElement, BottomDrawerProps>(
  ({ 
    open, 
    onOpenChange, 
    children, 
    className, 
    showOverlay = true,
    snapPoints = [0.9],
    defaultSnapPoint = 0,
    closeThreshold = 0.2
  }, ref) => {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground={false}
        snapPoints={snapPoints}
        defaultSnapPoint={defaultSnapPoint}
        closeThreshold={closeThreshold}
      >
        {showOverlay && <DrawerOverlay className="fixed inset-0 z-40 bg-black/40" />}
        <DrawerPortal>
          <DrawerContent className={cn(
            "fixed bottom-0 left-0 right-0 z-50 mt-24 bg-background rounded-t-[24px] border-t border-border",
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
