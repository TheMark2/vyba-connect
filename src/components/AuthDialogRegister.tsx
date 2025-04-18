import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (info: { fullName: string; email: string }) => void;
}

const AuthDialogRegister: React.FC<Props> = ({ open, onOpenChange, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(false);

    if (value.length === 0) return setPasswordStrength(null);
    if (value.length < 6) return setPasswordStrength('weak');
    if (value.length < 10) return setPasswordStrength('medium');

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);

    if (hasUpper && hasLower && hasNumber) setPasswordStrength('strong');
    else setPasswordStrength('medium');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let error = false;

    if (!fullName) {
      setFullNameError(true);
      error = true;
    }
    if (!email) {
      setEmailError(true);
      error = true;
    }
    if (!password) {
      setPasswordError(true);
      error = true;
    }

    if (error) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      onSuccess({ fullName, email });
    }, 2000);
  };

  const getPasswordRequirements = () => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 10;

    if (!password) return null;

    if (passwordStrength === 'weak') {
      return (
        <p className="text-xs text-[#ea384c]">
          Contraseña muy débil
          {!isLongEnough && <span> - <strong>Añade {10 - password.length} caracteres</strong></span>}
          {!hasUpper && <span> - <strong>Incluye una mayúscula</strong></span>}
          {!hasLower && <span> - <strong>Incluye una minúscula</strong></span>}
          {!hasNumber && <span> - <strong>Incluye un número</strong></span>}
        </p>
      );
    }

    if (passwordStrength === 'medium') {
      return (
        <p className="text-xs text-[#FF9248]">
          Contraseña débil
          {!isLongEnough && <span> - <strong>Añade {10 - password.length} caracteres</strong></span>}
          {!hasUpper && <span> - <strong>Incluye una mayúscula</strong></span>}
          {!hasLower && <span> - <strong>Incluye una minúscula</strong></span>}
          {!hasNumber && <span> - <strong>Incluye un número</strong></span>}
        </p>
      );
    }

    if (passwordStrength === 'strong') {
      return <p className="text-xs text-[#4CAF50]">Contraseña segura</p>;
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full rounded-2xl space-y-6 bg-white pt-0">
        <div className="flex flex-col gap-2 px-12">
          <h2 className="text-2xl font-semibold text-left mb-0 mt-0">Regístrate con tu correo</h2>
          <p className="text-sm font-light">Introduce tu correo y te enviaremos un código de verificación para crear tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-12">
          <div>
            <label className={`block font-medium ${fullNameError ? 'text-[#C13515]' : ''}`}>Nombre completo</label>
            <Input
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setFullNameError(false);
              }}
              placeholder="Ramón Prado"
              error={fullNameError}
              className="bg-[#F7F7F7]"
            />
            {fullNameError && <p className="text-sm text-[#C13515]">Por favor, introduce tu nombre completo</p>}
          </div>

          <div>
            <label className={`block font-medium ${emailError ? 'text-[#C13515]' : ''}`}>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              placeholder="tuemail@ejemplo.com"
              error={emailError}
              className="bg-[#F7F7F7]"
            />
            {emailError && <p className="text-sm text-[#C13515]">Por favor, introduce tu email</p>}
          </div>

          <div>
            <label className={`block font-medium ${passwordError ? 'text-[#C13515]' : ''}`}>Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              error={passwordError}
              className="bg-[#F7F7F7]"
            />
            {getPasswordRequirements()}
            {passwordError && <p className="text-sm text-[#C13515]">Por favor, introduce una contraseña</p>}
          </div>

          <div className="w-full text-center">
            <Button type="submit" className="px-16 bg-[#D4DDFF] text-black hover:bg-[#C6D0FF]" isLoading={isLoading}>
              Registrarse
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialogRegister;
