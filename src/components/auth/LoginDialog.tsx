import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({
  open,
  onOpenChange
}: LoginDialogProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);

    // Simulación de inicio de sesión
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast.success(`Sesión iniciada con ${provider}`, {
        position: "bottom-center",
        duration: 3000
      });
      navigate("/artists");
    }, 1500);
  };

  const dialogContent = <>
      {isMobile && <div className="mb-2">
          <Button variant="ghost" size="icon" className="p-2 mb-4" onClick={() => onOpenChange(false)}>
            <ChevronLeft size={24} />
          </Button>
          
          <div className="text-3xl font-black">
            Inicia sesión para continuar
          </div>
        </div>}
      
      <div className={cn("flex flex-col space-y-2")}>
        {!isMobile && <div className="text-3xl font-black">
            Inicia sesión para continuar
          </div>}
        <p className="text-muted-foreground mb-6">
          Para añadir artistas a favoritos, necesitas iniciar sesión
        </p>
      </div>

      <div className="space-y-4 py-4">
        <div className="space-y-4">
          <Button variant="secondary" className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" onClick={() => handleSocialLogin("Google")} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="/logos/google-logo.svg" alt="Google" width={20} height={20} />}
            Continuar con Google
          </Button>
          
          <Button variant="secondary" className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" onClick={() => handleSocialLogin("Facebook")} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="/logos/facebook-logo.svg" alt="Facebook" width={20} height={20} />}
            Continuar con Facebook
          </Button>
          
          <Button variant="secondary" className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" onClick={() => handleSocialLogin("Apple")} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="/logos/apple-logo.svg" alt="Apple" width={20} height={20} />}
            Continuar con Apple
          </Button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-600">o</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <Button variant="secondary" className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" onClick={handleEmailLogin} disabled={isLoading}>
            <Mail size={20} />
            Continuar con Mail
          </Button>
        </div>
      </div>
    </>;

  if (isMobile) {
    return <BottomDrawer open={open} onOpenChange={onOpenChange} className="pt-8 pb-6 px-6" showCloseButton={false}>
        {dialogContent}
      </BottomDrawer>;
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {dialogContent}
        </DialogHeader>
      </DialogContent>
    </Dialog>;
};

export default LoginDialog;
