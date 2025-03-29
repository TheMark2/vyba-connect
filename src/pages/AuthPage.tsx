
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import { Eye, EyeOff } from 'lucide-react';

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
      <div className="bg-vyba-cream dark:bg-vyba-dark-bg flex flex-col px-6 md:px-10 lg:px-14 xl:px-16">
        <div className="w-full h-[90vh]">
          <Card className="border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary rounded-3xl overflow-hidden py-16 px-32">
            <div className="text-center mb-10">
              <h1 className="text-6xl font-black mb-2 dark:text-white">Bienvenido/a a VYBA</h1>
              <p className="text-lg font-medium dark:text-gray-300">Inicia sesión o regístrate</p>
            </div>

            <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
              <TabsContent value="login">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleSocialLogin('Google')}
                    >
                      Continuar con Google
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleSocialLogin('Facebook')}
                    >
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
                        className="rounded-xl px-4 py-5 h-auto"
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
                          className="rounded-xl px-4 py-5 h-auto pr-10"
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
                    
                    <Button 
                      type="submit" 
                      className="w-full rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2.5"
                    >
                      Iniciar sesión
                    </Button>
                  </form>

                  <div className="text-center">
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
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleSocialLogin('Google')}
                    >
                      Continuar con Google
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleSocialLogin('Facebook')}
                    >
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
                        className="rounded-xl px-4 py-5 h-auto"
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
                          className="rounded-xl px-4 py-5 h-auto"
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
                            className="rounded-xl px-4 py-5 h-auto pr-10"
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
                    
                    <Button 
                      type="submit" 
                      className="w-full rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2.5"
                    >
                      Siguiente
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ya tienes una cuenta? <button onClick={() => setDefaultTab("login")} className="text-blue-600 font-medium">Iniciar Sesión</button>
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
