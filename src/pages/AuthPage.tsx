import React, { useState } from 'react';
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
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Inicio de sesión exitoso", {
        description: "Redirigiendo a la página principal...",
        position: "bottom-center"
      });
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 500);
    }, 1000);
  };
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (registerStep < 2) {
      setTimeout(() => {
        setIsLoading(false);
        setRegisterStep(registerStep + 1);
      }, 800);
      return;
    }
    setTimeout(() => {
      navigate('/profile-info', {
        state: {
          role: registerForm.role
        }
      });
    }, 1000);
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
    setRegisterStep(1);
    setShowEmailLogin(false);
  };
  const switchToRegister = () => {
    setDefaultTab("register");
    setRegisterStep(1);
    setShowEmailLogin(false);
  };
  const handleBackStep = () => {
    setRegisterStep(1);
  };
  const handleShowEmailLogin = () => {
    setShowEmailLogin(true);
  };
  const handleBackToOptions = () => {
    setShowEmailLogin(false);
  };
  const seekerFeatures = ["Encuentra artistas según tus necesidades", "Acceso completo al catálogo de profesionales", "Comunícate directamente con los artistas"];
  const artistFeatures = ["Crea tu perfil profesional", "Recibe solicitudes de eventos", "Gestiona tu calendario de actuaciones", "Muestra tu portafolio a posibles clientes"];

  // Mobile View Component
  const MobileAuthView = () => {
    return <div className="min-h-[85vh] flex flex-col justify-center p-6 bg-secondary dark:bg-vyba-dark-bg">
        <AnimatePresence mode="wait">
          {!showEmailLogin ? <motion.div key="options" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} transition={{
          duration: 0.3
        }} className="flex flex-col items-center">
              <h1 className="text-5xl font-black mb-2">Bienvenido/a</h1>
              <h1 className="text-5xl font-black mb-6">a VYBA</h1>
              <p className="text-2xl mb-8">Inicia sesión o regístrate</p>
              
              <div className="w-full space-y-4">
                <Button variant="outline" className="w-full border-none bg-white text-black hover:bg-gray-100" onClick={() => handleSocialLogin('Google')}>
                  Continuar con Google
                </Button>
                <Button variant="outline" className="w-full border-none bg-white text-black hover:bg-gray-100" onClick={() => handleSocialLogin('Facebook')}>
                  Continuar con Facebook
                </Button>
                <Button variant="outline" className="w-full border-none bg-white text-black hover:bg-gray-100" onClick={handleShowEmailLogin}>
                  Continuar con mail
                </Button>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-sm">
                  No tienes cuenta? <span className="font-bold" onClick={switchToRegister}>Regístrate</span>
                </p>
              </div>
            </motion.div> : <motion.div key="email-login" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} transition={{
          duration: 0.3
        }} className="flex flex-col items-center">
              <h1 className="text-5xl font-black mb-2">Bienvenido/a</h1>
              <h1 className="text-5xl font-black mb-6">a VYBA</h1>
              <p className="text-2xl mb-8">Inicia sesión o regístrate</p>
              
              <form onSubmit={handleLoginSubmit} className="w-full space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <label htmlFor="mobile-email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input id="mobile-email" type="email" value={loginForm.email} onChange={e => setLoginForm({
                ...loginForm,
                email: e.target.value
              })} placeholder="Email" className="bg-white" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="mobile-password" className="block text-sm font-medium">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input id="mobile-password" type={showPassword ? "text" : "password"} value={loginForm.password} onChange={e => setLoginForm({
                  ...loginForm,
                  password: e.target.value
                })} placeholder="Contraseña" className="bg-white" required />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" isLoading={isLoading} className="">
                    Iniciar sesión
                  </Button>
                </div>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-sm">
                  No tienes cuenta? <span className="font-bold" onClick={switchToRegister}>Regístrate</span>
                </p>
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>;
  };
  return <PageTransition>
      <Navbar />
      {isMobile ? <MobileAuthView /> : <div className="bg-vyba-cream dark:bg-vyba-dark-bg flex items-center justify-center min-h-[90vh] px-6 md:px-10 lg:px-14 xl:px-16">
          <Card className="border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary rounded-3xl overflow-hidden w-full py-16 mx-auto">
            <div className="text-center mb-10 max-w-2xl mx-auto px-12">
              <AnimatePresence mode="wait">
                {registerStep === 2 && defaultTab === "register" ? <motion.h1 key="role-selection" className="text-6xl font-black mb-4 dark:text-white" initial={{
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
                  </motion.h1> : <motion.div key="welcome" initial={{
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
                  </motion.div>}
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
                      <Button type="button" variant="outline" className="border-none w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100" onClick={() => handleSocialLogin('Google')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        Continuar con Google
                      </Button>
                      <Button type="button" variant="outline" className="border-none w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100" onClick={() => handleSocialLogin('Facebook')}>
                        <Facebook size={20} color="#1877F2" />
                        Continuar con Facebook
                      </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="relative flex items-center">
                      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                      <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase font-medium">O CONTINÚA CON EMAIL</span>
                      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </motion.div>

                    <motion.form variants={itemVariants} onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="login-email" className="block text-sm font-medium dark:text-white">
                          Email
                        </label>
                        <Input id="login-email" type="email" value={loginForm.email} onChange={e => setLoginForm({
                      ...loginForm,
                      email: e.target.value
                    })} placeholder="Escribe tu correo" required className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label htmlFor="login-password" className="block text-sm font-medium dark:text-white">
                          Contraseña
                        </label>
                        <div className="relative">
                          <Input id="login-password" type={showPassword ? "text" : "password"} value={loginForm.password} onChange={e => setLoginForm({
                        ...loginForm,
                        password: e.target.value
                      })} placeholder="Escribe tu contraseña" required className="rounded-xl h-12 pr-10 bg-white dark:bg-black dark:text-white" />
                          <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
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
                        No tienes cuenta? <Button variant="link" className="p-0 h-auto font-medium" onClick={switchToRegister}>Regístrate</Button>
                      </p>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="register" key="register">
                  <AnimatePresence mode="wait">
                    {registerStep === 1 ? <motion.div className="space-y-6" key="register-step-1" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                          <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100" onClick={() => handleSocialLogin('Google')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                            Continuar con Google
                          </Button>
                          <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 bg-white text-black dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-100" onClick={() => handleSocialLogin('Facebook')}>
                            <Facebook size={20} color="#1877F2" />
                            Continuar con Facebook
                          </Button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative flex items-center">
                          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                          <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase font-medium">O CONTINÚA CON EMAIL</span>
                          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        </motion.div>

                        <motion.form variants={itemVariants} onSubmit={handleRegisterSubmit} className="space-y-4">
                          <div className="space-y-1.5">
                            <label htmlFor="register-name" className="block text-sm font-medium dark:text-white">
                              Nombre completo
                            </label>
                            <Input id="register-name" type="text" value={registerForm.fullName} onChange={e => setRegisterForm({
                        ...registerForm,
                        fullName: e.target.value
                      })} placeholder="Escribe tu nombre completo" required className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label htmlFor="register-email" className="block text-sm font-medium dark:text-white">
                                Email
                              </label>
                              <Input id="register-email" type="email" value={registerForm.email} onChange={e => setRegisterForm({
                          ...registerForm,
                          email: e.target.value
                        })} placeholder="Escribe tu correo" required className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" />
                            </div>
                            
                            <div className="space-y-1.5">
                              <label htmlFor="register-password" className="block text-sm font-medium dark:text-white">
                                Contraseña
                              </label>
                              <div className="relative">
                                <Input id="register-password" type={showPassword ? "text" : "password"} value={registerForm.password} onChange={e => setRegisterForm({
                            ...registerForm,
                            password: e.target.value
                          })} placeholder="Escribe tu contraseña" required className="rounded-xl h-12 pr-10 bg-white dark:bg-black dark:text-white" />
                                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
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
                      </motion.div> : registerStep === 2 ? <motion.div className="space-y-6" key="register-step-2" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                        <motion.form variants={itemVariants} onSubmit={handleRegisterSubmit} className="space-y-8">
                          <div className="overflow-hidden rounded-2xl">
                            <RadioGroup value={registerForm.role} onValueChange={value => setRegisterForm({
                        ...registerForm,
                        role: value
                      })} className="space-y-0">
                              <RoleSelector value="artist" label="Entrar como artista" icon={<Music size={20} />} features={artistFeatures} isFirst={true} isLast={false} />
                              <RoleSelector value="seeker" label="Entrar como buscador" icon={<Search size={20} />} features={seekerFeatures} isFirst={false} isLast={true} />
                            </RadioGroup>
                          </div>
                          
                          <div className="flex justify-center items-center gap-3 mt-8">
                            <Button type="button" variant="outline" onClick={handleBackStep} className="rounded-full p-3 border-none bg-white dark:bg-vyba-dark-secondary" disabled={isLoading}>
                              <ArrowLeft size={20} strokeWidth={3} />
                            </Button>
                            <Button type="submit" isLoading={isLoading}>
                              Siguiente
                            </Button>
                          </div>
                        </motion.form>
                        
                        <motion.div variants={itemVariants} className="text-center mt-6">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ya tienes una cuenta? <Button variant="link" className="p-0 h-auto font-medium" onClick={() => setDefaultTab("login")}>Iniciar Sesión</Button>
                          </p>
                        </motion.div>
                      </motion.div> : null}
                  </AnimatePresence>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </Card>
        </div>}
    </PageTransition>;
};
export default AuthPage;