
import React, { useState } from "react";
import { CheckCircle2, Flag } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ReportDialogProps {
  artistName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const reportReasons = [
  "Contenido inapropiado o ofensivo",
  "Suplantación de identidad",
  "Información falsa o engañosa",
  "Spam o estafa",
  "Otro motivo"
];

const ReportDialog = ({ artistName, isOpen, onClose, onSubmit }: ReportDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReasonChange = (value: string) => {
    setSelectedReason(value);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetails(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedReason) {
      toast.error("Por favor, selecciona un motivo para la denuncia");
      return;
    }

    setIsSubmitting(true);
    
    // Simulamos el envío con un timeout
    setTimeout(() => {
      onSubmit(selectedReason, details);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reiniciar después de mostrar el éxito
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    }, 1000);
  };

  const resetForm = () => {
    setSelectedReason("");
    setDetails("");
    setIsSuccess(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Denuncia enviada
              </>
            ) : (
              <>
                <Flag className="h-5 w-5 text-gray-600" />
                Denunciar perfil
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? "Gracias por ayudarnos a mantener nuestra plataforma segura. Revisaremos tu denuncia lo antes posible."
              : `Indica el motivo por el que quieres denunciar a ${artistName}`}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="pt-2 pb-4 space-y-6">
            <div className="space-y-4">
              <RadioGroup 
                value={selectedReason} 
                onValueChange={handleReasonChange}
                className="gap-3"
              >
                {reportReasons.map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={reason} 
                      id={reason} 
                      className="border-gray-300"
                    />
                    <Label 
                      htmlFor={reason} 
                      className="text-base font-normal cursor-pointer"
                    >
                      {reason}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-details" className="text-sm text-gray-600">
                Detalles adicionales (opcional)
              </Label>
              <Textarea
                id="report-details"
                placeholder="Describe los detalles de tu denuncia..."
                value={details}
                onChange={handleDetailsChange}
                className="resize-none min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className={cn(
                  "px-4 py-2 h-10",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                onClick={handleSubmit}
                className="px-4 py-2 h-10"
                isLoading={isSubmitting}
              >
                Enviar denuncia
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <div className="rounded-full bg-green-50 p-6 dark:bg-green-900/20">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
