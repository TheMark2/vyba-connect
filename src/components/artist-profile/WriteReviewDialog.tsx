import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
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
    setRating(4);
    setAcceptedPolicy(false);
    onOpenChange(false);
  };
  const renderContent = () => <div className="flex flex-col w-full pt-8">
      <DialogClose className="absolute left-6 top-6 rounded-full p-1 text-black hover:bg-black/5 border-none dark:text-white">
        <X className="h-6 w-6" />
        <span className="sr-only">Cerrar</span>
      </DialogClose>
      
      <h2 className="text-3xl font-black mb-8">Escribe una reseña</h2>
      
      <div className="bg-[#F7F7F7] rounded-3xl p-6 mb-6 dark:bg-vyba-dark-secondary/20">
        <p className="text-[#918E8E] font-medium mb-1">Escribiendo como</p>
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 rounded-full">
            <AvatarFallback className="rounded-full">R</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-base font-medium">Ramón</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, index) => <Star key={index} className={`h-8 w-8 cursor-pointer ${index < rating ? "text-black fill-black dark:text-white dark:fill-white" : "text-gray-300 dark:text-gray-600"}`} onClick={() => setRating(index + 1)} />)}
        </div>
        <div className="text-xl font-medium">{rating}/5</div>
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
        <Button onClick={handleSubmit} disabled={!title || !comment || !acceptedPolicy} className="px-8 bg-[#D4DDFF] text-black dark:text-white">
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
      <DialogContent className="max-w-md p-8 rounded-[32px] border-none">
        {renderContent()}
      </DialogContent>
    </Dialog>;
};
export default WriteReviewDialog;