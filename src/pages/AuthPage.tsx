
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import { Eye, EyeOff, Facebook, Github } from 'lucide-react';

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
      <div className="bg-vyba-cream dark:bg-vyba-dark-bg flex items-center justify-center min-h-[90vh] px-6 md:px-10 lg:px-14 xl:px-16">
        <Card className="border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary rounded-3xl overflow-hidden py-16 px-12 md:px-24 mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-black mb-4 dark:text-white">Bienvenido/a a VYBA</h1>
            <p className="text-4xl dark:text-gray-300">Inicia sesión o regístrate</p>
          </div>

          <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
            <TabsContent value="login">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Continuar con Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100"
                    onClick={() => handleSocialLogin('Facebook')}
                  >
                    <Facebook size={20} color="#1877F2" />
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
                      className="rounded-xl px-4 py-5 h-auto bg-white dark:bg-white dark:text-black"
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
                        className="rounded-xl px-4 py-5 h-auto pr-10 bg-white dark:bg-white dark:text-black"
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
                  
                  <div className="flex justify-center">
                    <Button 
                      type="submit" 
                      className="rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2.5 px-12"
                    >
                      Iniciar sesión
                    </Button>
                  </div>
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
                    className="w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Continuar con Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100"
                    onClick={() => handleSocialLogin('Facebook')}
                  >
                    <Facebook size={20} color="#1877F2" />
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
                      className="rounded-xl px-4 py-5 h-auto bg-white dark:bg-white dark:text-black"
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
                        className="rounded-xl px-4 py-5 h-auto bg-white dark:bg-white dark:text-black"
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
                          className="rounded-xl px-4 py-5 h-auto pr-10 bg-white dark:bg-white dark:text-black"
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
                  
                  <div className="flex justify-center">
                    <Button 
                      type="submit" 
                      className="rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2.5 px-12"
                    >
                      Siguiente
                    </Button>
                  </div>
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
    </>
  );
};

export default AuthPage;
