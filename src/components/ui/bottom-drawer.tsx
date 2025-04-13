
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
  showCloseButton?: boolean;
}

const BottomDrawer = forwardRef<HTMLDivElement, BottomDrawerProps>(
  ({ 
    open, 
    onOpenChange, 
    children, 
    className, 
    showOverlay = true,
    showCloseButton = false
  }, ref) => {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground={false}
      >
        {showOverlay && <DrawerOverlay className="fixed inset-0 z-40 bg-black/40" />}
        <DrawerPortal>
          <DrawerContent className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-[24px] border-t",
            className
          )}>
            <div ref={ref} className="h-full w-full relative">
              {showCloseButton && (
                <DrawerClose className="absolute left-6 top-8 rounded-full p-2 hover:bg-muted/20 z-50 border-none">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Cerrar</span>
                </DrawerClose>
              )}
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
