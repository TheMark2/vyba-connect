import React, { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const PHONE_PREFIXES = [
  { value: "+34", label: "España (+34)" },
  { value: "+1", label: "Estados Unidos (+1)" },
  { value: "+44", label: "Reino Unido (+44)" },
  { value: "+49", label: "Alemania (+49)" },
  { value: "+33", label: "Francia (+33)" },
  { value: "+39", label: "Italia (+39)" },
];

interface PhoneVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function PhoneVerificationDialog({
  open,
  onOpenChange,
  userId,
}: PhoneVerificationDialogProps) {
  const [phone, setPhone] = useState("");
  const [prefix, setPrefix] = useState("+34");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "code">("phone");

  const formatPhoneNumber = (phoneNumber: string) => {
    return `${prefix}${phoneNumber.replace(/\D/g, '')}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phone);

      // Enviar el código OTP
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone
      });

      if (error) throw error;

      toast.success("Código de verificación enviado");
      setStep("code");
    } catch (error: any) {
      console.error("Error al enviar código:", error);
      toast.error(error.message || "Error al enviar el código de verificación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phone);

      // Verificar el código OTP
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: verificationCode,
        type: 'sms'
      });

      if (error) throw error;

      // Solo actualizamos el perfil si la verificación fue exitosa
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          phone: formattedPhone,
          phone_verified: true 
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      toast.success("Teléfono verificado correctamente");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error al verificar código:", error);
      toast.error(error.message || "Error al verificar el código");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={step === "phone" ? "Proceso de verificación" : "Introduce el código"}
    >
      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-6 px-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Número de teléfono</Label>
            <div className="flex gap-2">
              <Select value={prefix} onValueChange={setPrefix}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Selecciona país" />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_PREFIXES.map((prefix) => (
                    <SelectItem key={prefix.value} value={prefix.value}>
                      {prefix.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder="600 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="flex-1"
              />
            </div>
            <p className="text-sm text-gray-500">
              Te enviaremos un código de verificación por SMS
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Enviar código
          </Button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-8 px-12">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-light mb-4 text-black">
              Inserta el código que te hemos enviado por SMS a {prefix}{phone}
            </p>
            <InputOTP
              value={verificationCode}
              onChange={(value) => setVerificationCode(value)}
              maxLength={6}
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="rounded-md bg-[#F7F7F7] w-10 h-12 text-center text-lg focus:ring-0 focus:outline-none"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || verificationCode.length !== 6}
            isLoading={isLoading}
          >
            Verificar
          </Button>
        </form>
      )}
    </ResponsiveDialog>
  );
} 