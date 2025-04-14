
import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Smile, Frown, Meh, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface WriteReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reviewData: ReviewData) => void;
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
  onSubmit
}: WriteReviewDialogProps) => {
  const isMobile = useIsMobile();
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(4);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!title || !comment || !acceptedPolicy) return;
    onSubmit({
      title,
      comment,
      rating,
      acceptedPolicy
    });

    // Reset form
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

  const renderContent = () => <div className="flex flex-col w-full">
      <DialogClose className="absolute right-6 top-6 rounded-full p-1 text-black hover:bg-black/5 border-none dark:text-white">
        <X className="h-6 w-6" />
        <span className="sr-only">Cerrar</span>
      </DialogClose>
      
      <h2 className="text-3xl font-black mb-6">Escribe una reseña</h2>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="bg-[#F7F7F7] rounded-2xl px-6 py-3 dark:bg-vyba-dark-secondary/20">
          <p className="text-[#918E8E] text-sm font-medium mb-3">Escribiendo como</p>
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 rounded-full">
              <AvatarImage src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Avatar de usuario" />
              <AvatarFallback className="rounded-full">AP</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-base font-medium">Alejandro Pérez</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <motion.div 
            className="flex items-center gap-2 bg-[#F7F7F7] rounded-full px-4 py-2 dark:bg-vyba-dark-secondary/20"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              key={rating}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {getFaceIcon(rating)}
            </motion.div>
            <motion.span 
              className="text-xl font-medium"
              key={rating}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {rating}/5
            </motion.span>
          </motion.div>
          
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star 
                  className={`h-8 w-8 cursor-pointer transition-colors duration-300 ${
                    (hoveredRating !== null ? index < hoveredRating : index < rating) 
                      ? "text-black fill-black dark:text-white dark:fill-white" 
                      : "text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600"
                  }`} 
                  onClick={() => setRating(index + 1)}
                  onMouseEnter={() => setHoveredRating(index + 1)}
                  onMouseLeave={() => setHoveredRating(null)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="title" className="text-base font-medium mb-2 block">
          Dale un título a la reseña
        </label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Muy buen servicio" />
      </div>
      
      <div className="mb-8">
        <label htmlFor="comment" className="text-base font-medium mb-2 block">
          Describe la reseña
        </label>
        <Textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="Muy buen servicio" className="min-h-32" />
      </div>
      
      <div className="flex items-center mb-8 bg-[#F7F7F7] rounded-xl p-4 relative overflow-hidden transition-all duration-300 hover:bg-[#F0F0F0] dark:bg-vyba-dark-secondary/20 dark:hover:bg-vyba-dark-secondary/30">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Checkbox 
              id="terms" 
              checked={acceptedPolicy} 
              onCheckedChange={checked => setAcceptedPolicy(checked as boolean)} 
              className="h-5 w-5 rounded-sm border-2 border-black data-[state=checked]:border-black" 
            />
            <label 
              htmlFor="terms" 
              className="text-sm font-medium cursor-pointer"
            >
              Acepto la política de privacidad
            </label>
          </div>
          
          <a 
            href="#" 
            className="text-sm text-black font-medium underline decoration-1 underline-offset-2 hover:no-underline transition-all"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add logic to show privacy policy
              console.log("Open privacy policy");
            }}
          >
            Ver política
          </a>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!title || !comment || !acceptedPolicy} className="px-8 bg-[#D4DDFF] hover:bg-[#C0D0FF] text-black dark:text-white rounded-full">
          Enviar
        </Button>
      </div>
    </div>;

  if (isMobile) {
    return <BottomDrawer open={isOpen} onOpenChange={onOpenChange} className="p-6 pt-0" showCloseButton={false}>
        {renderContent()}
      </BottomDrawer>;
  }
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] p-8 rounded-[32px] border-none">
        {renderContent()}
      </DialogContent>
    </Dialog>;
};

export default WriteReviewDialog;
