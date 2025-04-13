
import React, { forwardRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerPortal,
  DrawerOverlay,
  DrawerClose
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

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
            <DrawerClose className="absolute left-6 top-8 z-50 rounded-full p-2 hover:bg-muted/20">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DrawerClose>
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
