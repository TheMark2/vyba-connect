
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import { Eye, EyeOff, Facebook, Search, Music, ArrowLeft } from 'lucide-react';
import { RadioGroup, RoleSelector } from '@/components/ui/radio-group';
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from '@/components/ui/page-transition';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -10
  }
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [defaultTab, setDefaultTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'artist'
  });
  const [registerStep, setRegisterStep] = useState(1);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log("[AuthPage] Componente montado");
    console.log("[AuthPage] Estado inicial - isMobile:", isMobile);
    console.log("[AuthPage] Estado inicial - showEmailLogin:", showEmailLogin);
    console.log("[AuthPage] Estado inicial - defaultTab:", defaultTab);
    console.log("[AuthPage] Estado inicial - registerStep:", registerStep);
    
    return () => {
      console.log("[AuthPage] Componente desmontado");
    };
  }, []);

  useEffect(() => {
    console.log("[AuthPage] Cambio en vista móvil:", isMobile);
  }, [isMobile]);

  useEffect(() => {
    console.log("[AuthPage] Cambio en showEmailLogin:", showEmailLogin);
  }, [showEmailLogin]);

  useEffect(() => {
    console.log("[AuthPage] Cambio en defaultTab:", defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    console.log("[AuthPage] Cambio en registerStep:", registerStep);
  }, [registerStep]);

  // Esquema de validación para el formulario de login
  const loginSchema = z.object({
    email: z.string().email("Ingresa un email válido"),
    password: z.string().min(1, "La contraseña es obligatoria")
  });

  // Esquema para el formulario de registro
  const registerSchema = z.object({
    fullName: z.string().min(1, "El nombre completo es obligatorio"),
    email: z.string().email("Ingresa un email válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.enum(["artist", "seeker"]).default("artist")
  });

  // Formulario para login utilizando react-hook-form
  const loginFormHook = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Formulario para registro utilizando react-hook-form
  const registerFormHook = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'artist'
    }
  });

  const handleLoginSubmit = useCallback((values: z.infer<typeof loginSchema>) => {
    console.log("[AuthPage] handleLoginSubmit - Iniciando login con:", values);
    setIsLoading(true);
    setTimeout(() => {
      console.log("[AuthPage] handleLoginSubmit - Login exitoso");
      toast.success("Inicio de sesión exitoso", {
        description: "Redirigiendo a la página principal...",
        position: "bottom-center"
      });
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 500);
    }, 1000);
  }, [navigate]);

  const handleRegisterStepOne = useCallback((values: z.infer<typeof registerSchema>) => {
    console.log("[AuthPage] handleRegisterStepOne - Datos:", values);
    setRegisterForm(values);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRegisterStep(2);
      console.log("[AuthPage] handleRegisterStepOne - Avanzando al paso 2");
    }, 800);
  }, []);

  const handleRegisterSubmit = useCallback((values: z.infer<typeof registerSchema>) => {
    console.log("[AuthPage] handleRegisterSubmit - Datos:", values);
    setIsLoading(true);
    setTimeout(() => {
      console.log("[AuthPage] handleRegisterSubmit - Registro completado, redirigiendo a profile-info");
      navigate('/profile-info', {
        state: {
          role: values.role
        }
      });
    }, 1000);
  }, [navigate]);

  const handleSocialLogin = useCallback((provider: string) => {
    console.log("[AuthPage] handleSocialLogin - Intentando login con:", provider);
    toast.info(`Iniciando sesión con ${provider}`, {
      description: "Esta función estará disponible próximamente",
      position: "bottom-center"
    });
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    console.log("[AuthPage] togglePasswordVisibility - Cambiando visibilidad:", !showPassword);
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleTabChange = useCallback((value: string) => {
    console.log("[AuthPage] handleTabChange - Cambiando a tab:", value);
    setDefaultTab(value);
    setRegisterStep(1);
    setShowEmailLogin(false);
  }, []);

  const switchToRegister = useCallback(() => {
    console.log("[AuthPage] switchToRegister - Cambiando a registro");
    setDefaultTab("register");
    setRegisterStep(1);
    setShowEmailLogin(false);
  }, []);

  const handleBackStep = useCallback(() => {
    console.log("[AuthPage] handleBackStep - Volviendo al paso 1");
    setRegisterStep(1);
  }, []);

  const handleShowEmailLogin = useCallback(() => {
    console.log("[AuthPage] handleShowEmailLogin - Mostrando login por email");
    setShowEmailLogin(true);
  }, []);

  const handleBackToOptions = useCallback(() => {
    console.log("[AuthPage] handleBackToOptions - Volviendo a opciones");
    setShowEmailLogin(false);
  }, []);

  const updateLoginForm = useCallback((field: keyof typeof loginForm, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateRegisterForm = useCallback((field: keyof typeof registerForm, value: string) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const seekerFeatures = ["Encuentra artistas según tus necesidades", "Acceso completo al catálogo de profesionales", "Comunícate directamente con los artistas"];
  const artistFeatures = ["Crea tu perfil profesional", "Recibe solicitudes de eventos", "Gestiona tu calendario de actuaciones", "Muestra tu portafolio a posibles clientes"];

  const MobileAuthView = () => {
    console.log("[AuthPage] Renderizando MobileAuthView - showEmailLogin:", showEmailLogin);
    
    return (
      <div className="min-h-[85vh] flex flex-col justify-center p-6 bg-secondary dark:bg-vyba-dark-bg">
        <AnimatePresence mode="wait">
          {!showEmailLogin ? (
            <motion.div 
              key="options" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.3 }} 
              className="flex flex-col items-center"
            >
              <h1 className="text-5xl font-black mb-2">Bienvenido/a</h1>
              <h1 className="text-5xl font-black mb-6">a VYBA</h1>
              <p className="text-2xl mb-8">Inicia sesión o regístrate</p>
              
              <div className="w-full space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full border-none bg-white text-black hover:bg-gray-100" 
                  onClick={() => handleSocialLogin('Google')}
                >
                  Continuar con Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-none bg-white text-black hover:bg-gray-100" 
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  Continuar con Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-none bg-white text-black hover:bg-gray-100" 
                  onClick={handleShowEmailLogin}
                >
                  Continuar con mail
                </Button>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-sm">
                  No tienes cuenta? <span className="font-bold cursor-pointer" onClick={switchToRegister}>Regístrate</span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="email-login" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.3 }} 
              className="flex flex-col items-center"
            >
              <div className="w-full flex mb-6">
                <Button 
                  variant="ghost" 
                  className="p-2 -ml-2" 
                  onClick={handleBackToOptions}
                >
                  <ArrowLeft size={24} />
                </Button>
              </div>
              
              <h1 className="text-5xl font-black mb-2">Bienvenido/a</h1>
              <h1 className="text-5xl font-black mb-6">a VYBA</h1>
              <p className="text-2xl mb-8">Inicia sesión o regístrate</p>
              
              <Form {...loginFormHook}>
                <form 
                  onSubmit={loginFormHook.handleSubmit(handleLoginSubmit)} 
                  className="w-full space-y-6 max-w-2xl"
                >
                  <FormField
                    control={loginFormHook.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Email" 
                            className="bg-white" 
                            type="email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginFormHook.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Contraseña" 
                              className="bg-white" 
                              type={showPassword ? "text" : "password"} 
                              {...field} 
                            />
                            <button 
                              type="button" 
                              onClick={() => togglePasswordVisibility()} 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-center pt-4">
                    <Button type="submit" disabled={isLoading} isLoading={isLoading}>
                      Iniciar sesión
                    </Button>
                  </div>
                </form>
              </Form>
              
              <div className="mt-8 text-center">
                <p className="text-sm">
                  No tienes cuenta? <span className="font-bold cursor-pointer" onClick={switchToRegister}>Regístrate</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  console.log("[AuthPage] Renderizando AuthPage - isMobile:", isMobile);

  return (
    <PageTransition>
      <Navbar />
      {isMobile ? (
        <MobileAuthView />
      ) : (
        <div className="bg-vyba-cream dark:bg-vyba-dark-bg flex items-center justify-center min-h-[90vh] px-6 md:px-10 lg:px-14 xl:px-16">
          <Card className="border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary rounded-3xl overflow-hidden w-full py-16 mx-auto">
            <div className="text-center mb-10 max-w-2xl mx-auto px-12">
              <AnimatePresence mode="wait">
                {registerStep === 2 && defaultTab === "register" ? (
                  <motion.h1 key="role-selection" className="text-6xl font-black mb-4 dark:text-white" initial={{
                    opacity: 0,
                    y: -20
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    y: 20
                  }} transition={{
                    duration: 0.5
                  }}>
                    ¿Cómo quieres usar VYBA?
                  </motion.h1>
                ) : (
                  <motion.div key="welcome" initial={{
                    opacity: 0,
                    y: -20
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    y: 20
                  }} transition={{
                    duration: 0.5
                  }}>
                    <h1 className="text-6xl font-black mb-4 dark:text-white">Bienvenido/a a VYBA</h1>
                    <p className="text-4xl dark:text-gray-300">Inicia sesión o regístrate</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Tabs defaultValue={defaultTab} value={defaultTab} onValueChange={handleTabChange} className="max-w-2xl mx-auto px-12">
              <TabsList className="hidden">
                <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                <TabsContent value="login" key="login">
                  <motion.div className="space-y-6" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="border-none w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleSocialLogin('Google');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        Continuar con Google
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="border-none w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleSocialLogin('Facebook');
                        }}
                      >
                        <Facebook size={20} color="#1877F2" />
                        Continuar con Facebook
                      </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="relative flex items-center">
                      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                      <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase font-medium">O CONTINÚA CON EMAIL</span>
                      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </motion.div>

                    <motion.form 
                      variants={itemVariants} 
                      onSubmit={(e) => {
                        e.preventDefault();
                        loginFormHook.handleSubmit(handleLoginSubmit)(e);
                      }} 
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label htmlFor="login-email" className="block text-sm font-medium dark:text-white">
                          Email
                        </label>
                        <Input 
                          id="login-email" 
                          type="email" 
                          value={loginForm.email} 
                          onChange={(e) => {
                            updateLoginForm('email', e.target.value);
                          }} 
                          placeholder="Escribe tu correo" 
                          required 
                          className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
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
                            onChange={(e) => {
                              updateLoginForm('password', e.target.value);
                            }} 
                            placeholder="Escribe tu contraseña" 
                            required 
                            className="rounded-xl h-12 pr-10 bg-white dark:bg-black dark:text-white" 
                          />
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.preventDefault();
                              togglePasswordVisibility();
                            }} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-center mt-8">
                        <Button type="submit" isLoading={isLoading}>
                          Iniciar sesión
                        </Button>
                      </div>
                    </motion.form>

                    <motion.div variants={itemVariants} className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No tienes cuenta? <Button 
                          variant="link" 
                          className="p-0 h-auto font-medium" 
                          onClick={(e) => {
                            e.preventDefault();
                            switchToRegister();
                          }}
                        >Regístrate</Button>
                      </p>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="register" key="register">
                  <AnimatePresence mode="wait">
                    {registerStep === 1 ? (
                      <motion.div className="space-y-6" key="register-step-1" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleSocialLogin('Google');
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                            Continuar con Google
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleSocialLogin('Facebook');
                            }}
                          >
                            <Facebook size={20} color="#1877F2" />
                            Continuar con Facebook
                          </Button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative flex items-center">
                          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                          <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase font-medium">O CONTINÚA CON EMAIL</span>
                          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        </motion.div>

                        <motion.form 
                          variants={itemVariants} 
                          onSubmit={(e) => {
                            e.preventDefault();
                            registerFormHook.handleSubmit(handleRegisterStepOne)(e);
                          }} 
                          className="space-y-4"
                        >
                          <div className="space-y-1.5">
                            <label htmlFor="register-name" className="block text-sm font-medium dark:text-white">
                              Nombre completo
                            </label>
                            <Input 
                              id="register-name" 
                              type="text" 
                              value={registerForm.fullName} 
                              onChange={(e) => {
                                updateRegisterForm('fullName', e.target.value);
                              }} 
                              placeholder="Escribe tu nombre completo" 
                              required 
                              className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
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
                                onChange={(e) => {
                                  updateRegisterForm('email', e.target.value);
                                }} 
                                placeholder="Escribe tu correo" 
                                required 
                                className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
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
                                  onChange={(e) => {
                                    updateRegisterForm('password', e.target.value);
                                  }} 
                                  placeholder="Escribe tu contraseña" 
                                  required 
                                  className="rounded-xl h-12 pr-10 bg-white dark:bg-black dark:text-white" 
                                />
                                <button 
                                  type="button" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    togglePasswordVisibility();
                                  }} 
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center mt-8">
                            <Button type="submit" isLoading={isLoading}>
                              Siguiente
                            </Button>
                          </div>
                        </motion.form>
                      </motion.div>
                    ) : registerStep === 2 ? (
                      <motion.div className="space-y-6" key="register-step-2" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                        <motion.form 
                          variants={itemVariants} 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleRegisterSubmit(registerForm);
                          }} 
                          className="space-y-8"
                        >
                          <div className="overflow-hidden rounded-2xl">
                            <RadioGroup 
                              value={registerForm.role} 
                              onValueChange={(value) => {
                                updateRegisterForm('role', value);
                              }} 
                              className="space-y-0"
                            >
                              <RoleSelector 
                                value="artist" 
                                label="Soy artista" 
                                icon={<Music size={20} />} 
                                features={artistFeatures} 
                                isFirst={true} 
                              />
                              <RoleSelector 
                                value="seeker" 
                                label="Busco artistas" 
                                icon={<Search size={20} />} 
                                features={seekerFeatures} 
                                isLast={true} 
                              />
                            </RadioGroup>
                          </div>
                          
                          <div className="flex justify-between">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={handleBackStep}
                            >
                              Atrás
                            </Button>
                            <Button 
                              type="submit" 
                              isLoading={isLoading}
                            >
                              Completar registro
                            </Button>
                          </div>
                        </motion.form>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </Card>
        </div>
      )}
    </PageTransition>
  );
};

export default AuthPage;
