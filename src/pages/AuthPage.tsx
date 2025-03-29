
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import { Eye, EyeOff, Facebook, LucideProps } from 'lucide-react';

// Google icon no está disponible en lucide-react, así que lo creamos
const Google = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M17.5 12c0-3.038-2.462-5.5-5.5-5.5s-5.5 2.462-5.5 5.5c0 2.568 1.763 4.733 4.138 5.307C12.274 17.866 13.5 16.803 13.5 15c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 .353.072.686.184 1" />
  </svg>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const [defaultTab, setDefaultTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para el formulario de inicio de sesión
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Estados para el formulario de registro
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica de autenticación real
    toast.success("Inicio de sesión exitoso", {
      description: "Redirigiendo a la página principal...",
      position: "bottom-center"
    });
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica de registro real
    toast.success("Registro exitoso", {
      description: "Tu cuenta ha sido creada. Redirigiendo...",
      position: "bottom-center"
    });
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Iniciando sesión con ${provider}`, {
      description: "Esta función estará disponible próximamente",
      position: "bottom-center"
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTabChange = (value: string) => {
    setDefaultTab(value);
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-vyba-cream dark:bg-vyba-dark-bg px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-black mb-3 dark:text-white">Bienvenido/a a VYBA</h1>
            <p className="text-xl dark:text-gray-300">Inicia sesión o regístrate</p>
          </div>
          
          <div className="bg-white dark:bg-vyba-dark-bg rounded-2xl p-8 shadow-sm">
            <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
              <TabsContent value="login">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-black"
                      onClick={() => handleSocialLogin('Google')}
                    >
                      <Google className="h-5 w-5" />
                      Continuar con Google
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-black"
                      onClick={() => handleSocialLogin('Facebook')}
                    >
                      <Facebook className="h-5 w-5" />
                      Continuar con Facebook
                    </Button>
                  </div>

                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase font-medium">O CONTINÚA CON EMAIL</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="login-email" className="block text-sm font-medium dark:text-white">
                        Email
                      </label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        placeholder="Escribe tu correo"
                        required
                        className="rounded-xl px-4 py-5 h-auto bg-white dark:bg-vyba-dark-secondary"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="login-password" className="block text-sm font-medium dark:text-white">
                        Contraseña
                      </label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                          placeholder="Escribe tu contraseña"
                          required
                          className="rounded-xl px-4 py-5 h-auto pr-10 bg-white dark:bg-vyba-dark-secondary"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <Button 
                        type="submit" 
                        className="rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2.5 px-12"
                      >
                        Iniciar sesión
                      </Button>
                    </div>
                  </form>

                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No tienes cuenta? <button onClick={() => setDefaultTab("register")} className="text-blue-600 font-medium">Regístrate</button>
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-black"
                      onClick={() => handleSocialLogin('Google')}
                    >
                      <Google className="h-5 w-5" />
                      Continuar con Google
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-black"
                      onClick={() => handleSocialLogin('Facebook')}
                    >
                      <Facebook className="h-5 w-5" />
                      Continuar con Facebook
                    </Button>
                  </div>

                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase font-medium">O CONTINÚA CON EMAIL</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="register-name" className="block text-sm font-medium dark:text-white">
                        Nombre completo
                      </label>
                      <Input
                        id="register-name"
                        type="text"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})}
                        placeholder="Escribe tu nombre"
                        required
                        className="rounded-xl px-4 py-5 h-auto bg-white dark:bg-vyba-dark-secondary"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="register-email" className="block text-sm font-medium dark:text-white">
                          Email
                        </label>
                        <Input
                          id="register-email"
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                          placeholder="Escribe tu correo"
                          required
                          className="rounded-xl px-4 py-5 h-auto bg-white dark:bg-vyba-dark-secondary"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label htmlFor="register-password" className="block text-sm font-medium dark:text-white">
                          Contraseña
                        </label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                            placeholder="Escribe tu contraseña"
                            required
                            className="rounded-xl px-4 py-5 h-auto pr-10 bg-white dark:bg-vyba-dark-secondary"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <Button 
                        type="submit" 
                        className="rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2.5 px-12"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </form>

                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ya tienes una cuenta? <button onClick={() => setDefaultTab("login")} className="text-blue-600 font-medium">Iniciar Sesión</button>
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
