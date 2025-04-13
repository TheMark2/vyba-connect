
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const navigate = useNavigate();
  
  const handleEmailLogin = () => {
    onOpenChange(false);
    navigate("/auth");
  };
  
  const handleSocialLogin = (provider: string) => {
    onOpenChange(false);
    console.log(`Iniciar sesión con ${provider}`);
    navigate("/auth");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-black mb-2">Inicia sesión para continuar</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground mb-6">
            Para añadir artistas a favoritos, necesitas iniciar sesión
          </p>
          
          <div className="space-y-4">
            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
              onClick={() => handleSocialLogin("Google")}
            >
              <img src="/logos/google-logo.svg" alt="Google" width={20} height={20} />
              Continuar con Google
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
              onClick={() => handleSocialLogin("Facebook")}
            >
              <img src="/logos/facebook-logo.svg" alt="Facebook" width={20} height={20} />
              Continuar con Facebook
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
              onClick={() => handleSocialLogin("Apple")}
            >
              <img src="/logos/apple-logo.svg" alt="Apple" width={20} height={20} />
              Continuar con Apple
            </Button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">o</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
              onClick={handleEmailLogin}
            >
              <Mail size={20} />
              Continuar con Mail
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
