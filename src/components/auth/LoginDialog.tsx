
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEmailLogin = () => {
    setShowEmailForm(true);
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
  
  const handleSubmitEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de inicio de sesión con email
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast.success("Sesión iniciada correctamente", {
        position: "bottom-center",
        duration: 3000
      });
      navigate("/artists");
    }, 1500);
  };
  
  const handleBackToOptions = () => {
    setShowEmailForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-black mb-2 mt-4">Inicia sesión para continuar</DialogTitle>
        </DialogHeader>
        
        {!showEmailForm ? (
          <div className="space-y-4 py-4">
            <p className="text-center text-muted-foreground mb-6">
              Para añadir artistas a favoritos, necesitas iniciar sesión
            </p>
            
            <div className="space-y-4">
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
                onClick={() => handleSocialLogin("Google")}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="/logos/google-logo.svg" alt="Google" width={20} height={20} />}
                Continuar con Google
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
                onClick={() => handleSocialLogin("Facebook")}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="/logos/facebook-logo.svg" alt="Facebook" width={20} height={20} />}
                Continuar con Facebook
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
                onClick={() => handleSocialLogin("Apple")}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="/logos/apple-logo.svg" alt="Apple" width={20} height={20} />}
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
                disabled={isLoading}
              >
                <Mail size={20} />
                Continuar con Mail
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <form onSubmit={handleSubmitEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="tu@correo.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Contraseña" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              
              <div className="pt-2 space-y-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  isLoading={isLoading}
                >
                  Iniciar sesión
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleBackToOptions}
                  disabled={isLoading}
                >
                  Volver
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
