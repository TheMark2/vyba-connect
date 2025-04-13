import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const dialogContent = (
    <>
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-0 p-2"
          onClick={() => onOpenChange(false)}
        >
          <ChevronLeft size={24} />
        </Button>
      )}
      <div className="flex flex-col space-y-2">
        <div className="text-2xl font-black">
          Inicia sesión para continuar
        </div>
        <p className="text-muted-foreground mb-6">
          Para añadir artistas a favoritos, necesitas iniciar sesión
        </p>
      </div>

      {!showEmailForm ? (
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
      ) : (
        <div className="space-y-4 py-4">
          <form onSubmit={handleSubmitEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <Input id="email" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input id="password" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            
            <div className="flex justify-end">
              <a href="#" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            
            <div className="pt-2 flex space-x-4">
              <Button type="button" variant="secondary" size="icon" onClick={handleBackToOptions} disabled={isLoading} className="w-12 h-12">
                <ChevronLeft size={24} />
              </Button>
              
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <BottomDrawer 
        open={open} 
        onOpenChange={onOpenChange} 
        className="pt-8 pb-6 px-6"
        showCloseButton={false}
      >
        {dialogContent}
      </BottomDrawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {dialogContent}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
