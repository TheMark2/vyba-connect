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
          <p className="text-[#918E8E] font-medium mb-3">Escribiendo como</p>
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 rounded-full">
              <AvatarFallback className="rounded-full">R</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-base font-medium">Ramón</div>
              <div className="text-xs text-gray-500">hace 2 días</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-full px-4 py-2 dark:bg-vyba-dark-secondary/20">
            {getFaceIcon(rating)}
            <span className="text-xl font-medium">{rating}/5</span>
          </div>
          
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, index) => <Star key={index} className={`h-8 w-8 cursor-pointer ${index < rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`} onClick={() => setRating(index + 1)} />)}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="title" className="text-base font-medium mb-2 block">
          Dale un título a la reseña
        </label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Muy buen servicio" className="bg-[#F7F7F7] border-none focus-visible:ring-0 focus:ring-0 dark:bg-vyba-dark-secondary/20" />
      </div>
      
      <div className="mb-8">
        <label htmlFor="comment" className="text-base font-medium mb-2 block">
          Describe la reseña
        </label>
        <Textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="Muy buen servicio" className="min-h-32 bg-[#F7F7F7] border-none focus-visible:ring-0 focus:ring-0 dark:bg-vyba-dark-secondary/20" />
      </div>
      
      <div className="flex items-start space-x-2 mb-8">
        <Checkbox id="terms" checked={acceptedPolicy} onCheckedChange={checked => setAcceptedPolicy(checked as boolean)} className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Acepto la política de privacidad
          </label>
          <p className="text-xs text-gray-500">
            La mayoría de los músicos toman un descanso de 15 minutos después de 45 minutos de música, 
            por lo que "2 horas de música" significa 2 sets de 45 minutos, con descanso.
          </p>
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