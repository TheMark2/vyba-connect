
import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Smile, Frown, Meh, X, Mail, Facebook, Apple } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import LoginDialog from "../auth/LoginDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface WriteReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reviewData: ReviewData) => void;
  isLoggedIn?: boolean;
}

export interface ReviewData {
  title: string;
  comment: string;
  rating: number;
  acceptedPolicy: boolean;
}

const WriteReviewDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoggedIn = false
}: WriteReviewDialogProps) => {
  const isMobile = useIsMobile();
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(4);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (isOpen && isLoggedIn) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isLoggedIn]);

  const handleSubmit = () => {
    if (!title || !comment || !acceptedPolicy) return;
    onSubmit({
      title,
      comment,
      rating,
      acceptedPolicy
    });

    setTitle("");
    setComment("");
    setRating(1);
    setAcceptedPolicy(false);
    onOpenChange(false);
  };

  const getFaceIcon = (rating: number) => {
    switch (rating) {
      case 1:
        return <Frown className="w-6 h-6 text-red-500" />;
      case 2:
        return <Frown className="w-6 h-6 text-orange-500" />;
      case 3:
        return <Meh className="w-6 h-6 text-yellow-500" />;
      case 4:
        return <Smile className="w-6 h-6 text-green-500" />;
      case 5:
        return <Smile className="w-6 h-6 text-green-600" />;
      default:
        return null;
    }
  };

  const handleRippleEffect = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    element.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };

  const handleLoginClick = () => {
    setIsLoginDialogOpen(true);
    onOpenChange(false);
  };

  const renderLoginContent = () => {
    return <div className="flex flex-col w-full">
      <DialogClose className="absolute right-6 top-6 rounded-full p-1 text-black hover:bg-black/5 border-none dark:text-white">
        <X className="h-6 w-6" />
        <span className="sr-only">Cerrar</span>
      </DialogClose>
      
      <h2 className="text-3xl font-black mb-6">Inicia sesión o regístrate</h2>
      
      <div className="bg-[#F7F7F7] rounded-2xl p-6 mb-8 text-center dark:bg-vyba-dark-secondary/20">
        <p className="text-lg font-light text-gray-600 dark:text-gray-300 mb-8">
          Para escribir una reseña, primero debes iniciar sesión
        </p>
        
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col items-center">
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full mb-2 bg-white dark:bg-black border-0 hover:bg-gray-100 dark:hover:bg-gray-900" onClick={handleLoginClick}>
              <img src="/logos/google-logo.svg" alt="Google" className="w-8 h-8" />
            </Button>
            <span className="text-sm font-medium">Google</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full mb-2 bg-white dark:bg-black border-0 hover:bg-gray-100 dark:hover:bg-gray-900" onClick={handleLoginClick}>
              <img src="/logos/facebook-logo.svg" alt="Facebook" className="w-8 h-8" />
            </Button>
            <span className="text-sm font-medium">Facebook</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full mb-2 bg-white dark:bg-black border-0 hover:bg-gray-100 dark:hover:bg-gray-900" onClick={handleLoginClick}>
              <img src="/logos/apple-logo.svg" alt="Apple" className="w-8 h-8" />
            </Button>
            <span className="text-sm font-medium">Apple</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full mb-2 bg-white dark:bg-black border-0 hover:bg-gray-100 dark:hover:bg-gray-900" onClick={handleLoginClick}>
              <Mail className="h-8 w-8" />
            </Button>
            <span className="text-sm font-medium">Mail</span>
          </div>
        </div>
        
        <Button onClick={handleLoginClick} className="px-8 bg-[#D4DDFF] hover:bg-[#C0D0FF] text-black dark:text-white rounded-full transition-all duration-200 font-medium">
          Iniciar sesión
        </Button>
      </div>
    </div>;
  };

  const renderReviewContent = () => <div className="flex flex-col w-full">
      
      <h2 className="text-3xl font-semibold mb-6">Escribe una reseña</h2>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {isLoading ? (
          <div className="bg-[#F7F7F7] rounded-full pl-3 pr-6 py-3 dark:bg-vyba-dark-secondary/20 relative overflow-hidden">
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Skeleton className="h-11 w-11 rounded-full" />
              </motion.div>
              <div className="flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Skeleton className="w-24 h-3 mb-2" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Skeleton className="w-32 h-5" />
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            className="bg-[#F7F7F7] rounded-full pl-3 pr-6 py-3 dark:bg-vyba-dark-secondary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="h-11 w-11 rounded-full">
                  <AvatarImage src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Avatar de usuario" />
                  <AvatarFallback className="rounded-full">AP</AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex flex-col">
                <motion.p 
                  className="text-[#918E8E] text-xs font-light"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Escribiendo como
                </motion.p>
                <motion.div 
                  className="text-base font-medium"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  Alejandro Pérez
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="flex flex-col items-end gap-2">
          <motion.div className="flex items-center gap-2 bg-[#F7F7F7] rounded-full px-4 py-2 dark:bg-vyba-dark-secondary/20" initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} transition={{
          duration: 0.2
        }}>
            <div className="w-6 h-6 relative">
              <AnimatePresence mode="wait">
                <motion.div key={rating} initial={{
                opacity: 0,
                scale: 0.5
              }} animate={{
                opacity: 1,
                scale: 1
              }} exit={{
                opacity: 0,
                scale: 0.5
              }} transition={{
                duration: 0.2
              }} className="absolute inset-0">
                  {getFaceIcon(rating)}
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.span className="text-xl font-medium" key={rating} initial={{
              y: -5,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} exit={{
              y: 5,
              opacity: 0
            }} transition={{
              duration: 0.2
            }}>
                {rating}/5
              </motion.span>
            </AnimatePresence>
          </motion.div>
          
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, index) => <motion.div key={index} whileHover={{
            scale: 1.2
          }} whileTap={{
            scale: 0.9
          }}>
                <Star className={`h-8 w-8 cursor-pointer transition-colors duration-300 ${(hoveredRating !== null ? index < hoveredRating : index < rating) ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600"}`} onClick={() => setRating(index + 1)} onMouseEnter={() => setHoveredRating(index + 1)} onMouseLeave={() => setHoveredRating(null)} />
              </motion.div>)}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="title" className="text-sm font-medium mb-2 block">
          Dale un título a la reseña
        </label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Muy buen servicio" />
      </div>
      
      <div className="mb-8">
        <label htmlFor="comment" className="text-sm font-medium mb-2 block">
          Describe la reseña
        </label>
        <Textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="Muy buen servicio" className="min-h-32" />
      </div>
      
      <div className="flex items-center mb-8 bg-[#F7F7F7] rounded-xl p-4 relative overflow-hidden transition-all duration-200 hover:bg-[#F0F0F0] dark:bg-vyba-dark-secondary/20 dark:hover:bg-vyba-dark-secondary/30 cursor-pointer" onClick={e => {
      handleRippleEffect(e);
      setAcceptedPolicy(!acceptedPolicy);
    }}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Checkbox id="terms" checked={acceptedPolicy} onCheckedChange={checked => setAcceptedPolicy(checked as boolean)} className="h-5 w-5 rounded-sm border-2 border-black dark:border-white data-[state=checked]:border-black dark:data-[state=checked]:border-white transition-all duration-200" />
            <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
              Acepto la política de privacidad
            </label>
          </div>
          
          <a href="#" className="text-sm text-black font-medium underline decoration-1 underline-offset-2 hover:no-underline transition-all" onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Open privacy policy");
        }}>
            Ver política
          </a>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!title || !comment || !acceptedPolicy} className="px-8 bg-[#D4DDFF] hover:bg-[#C0D0FF] text-black dark:text-white rounded-full transition-all duration-200 font-medium">
          Enviar
        </Button>
      </div>
    </div>;

  const renderContent = () => isLoggedIn ? renderReviewContent() : renderLoginContent();

  if (isMobile) {
    return <>
        <BottomDrawer open={isOpen} onOpenChange={onOpenChange} className="p-6 pt-0" showCloseButton={false}>
          {renderContent()}
        </BottomDrawer>
        <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
      </>;
  }

  return <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[700px] rounded-[32px] border-none">
          {renderContent()}
        </DialogContent>
      </Dialog>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </>;
};

export default WriteReviewDialog;
