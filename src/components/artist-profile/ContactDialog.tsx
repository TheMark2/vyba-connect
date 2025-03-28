
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Clock, Edit, BellRing, Users, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import SuccessDialog from "./SuccessDialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistName: string;
  userImage?: string;
  userName?: string;
  artistImage?: string;
}

const ContactDialog = ({
  open,
  onOpenChange,
  artistName,
  userImage = "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
  userName = "Marc Vendrell",
  artistImage = "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png"
}: ContactDialogProps) => {
  const [date, setDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [currentView, setCurrentView] = useState("form"); // "form" o "policies"
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [acceptedPolicies, setAcceptedPolicies] = useState({
    contactTerms: false,
    privacyPolicy: false, 
    relatedArtists: false
  });

  const eventTypes = [
    { name: "Boda", value: "boda" },
    { name: "Cumpleaños", value: "cumpleanos" },
    { name: "Fiesta privada", value: "fiesta" },
    { name: "Evento corporativo", value: "corporativo" },
    { name: "Inauguración", value: "inauguracion" },
    { name: "Aniversario", value: "aniversario" }
  ];

  const durations = ["1h", "2h", "3h", "4h", "Personalizado"];

  const handleDurationSelect = (duration: string) => {
    if (duration === "Personalizado") {
      setShowCustomDuration(true);
      setSelectedDuration("");
    } else {
      setShowCustomDuration(false);
      setSelectedDuration(duration);
      setDuration(duration);
    }
  };

  const handleNextView = () => {
    setCurrentView("policies");
  };

  const handlePreviousView = () => {
    setCurrentView("form");
  };

  const handlePolicyChange = (policyName: keyof typeof acceptedPolicies) => {
    setAcceptedPolicies({
      ...acceptedPolicies,
      [policyName]: !acceptedPolicies[policyName]
    });
  };

  const handleSubmit = () => {
    console.log("Formulario enviado", {
      date,
      eventType,
      location,
      duration,
      message,
      acceptedPolicies
    });
    
    setSuccessDialogOpen(true);
    
    onOpenChange(false);
    
    setDate("");
    setEventType("");
    setLocation("");
    setDuration("");
    setMessage("");
    setShowCustomDuration(false);
    setSelectedDuration("");
    setCurrentView("form");
    setAcceptedPolicies({
      contactTerms: false,
      privacyPolicy: false,
      relatedArtists: false
    });
  };

  const handleRippleEffect = (event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };

  const handlePolicyDivClick = (policyName: keyof typeof acceptedPolicies) => {
    handlePolicyChange(policyName);
  };

  const handleEventTypeSelect = (value: string) => {
    setEventType(value);
  };

  const getSelectedEventTypeName = () => {
    const selected = eventTypes.find(type => type.value === eventType);
    return selected ? selected.name : "Selecciona el tipo de evento";
  };
  
  // Definición de las variantes de animación para transiciones de vista
  const pageVariants = {
    hidden: { opacity: 0, x: currentView === "form" ? -10 : 10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    },
    exit: { 
      opacity: 0, 
      x: currentView === "form" ? 10 : -10,
      transition: { 
        duration: 0.2,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className={`
            max-w-[500px]
            p-0
            border-none 
            bg-[#FAF8F6] dark:bg-vyba-dark-secondary
            ${isMobile ? 'pt-10 pb-28 px-6 rounded-t-[32px] max-h-[85vh]' : 'rounded-[40px] pt-12 px-8 pb-8'}
          `}
        >
          <DialogTitle className={`text-3xl font-black ${isMobile ? 'mb-6 mt-4' : 'mb-8 mt-2'}`}>
            Contacta con {artistName}
          </DialogTitle>
          
          <button 
            className={`flex justify-between items-center w-full p-3 rounded-xl transition-all duration-300 hover:bg-secondary cursor-pointer relative overflow-hidden ${isMobile ? 'mb-6' : 'mb-3'}`}
            onClick={handleRippleEffect}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-lg">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm text-gray-500">Contactando como</span>
                <span className="font-black text-xl">{userName}</span>
              </div>
            </div>
            
            <Button variant="secondary" size="icon" className="rounded-full h-7 w-7">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </button>

          <AnimatePresence mode="wait">
            {currentView === "form" ? (
              <motion.div
                key="form"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={pageVariants}
                className="w-full"
              >
                <ScrollArea className={`${isMobile ? 'h-[calc(70vh-280px)]' : 'h-[50vh]'} pr-2`}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium mb-2">
                        Fecha del evento
                      </label>
                      <Input id="date" type="text" placeholder="Fecha del evento" value={date} onChange={e => setDate(e.target.value)} className="bg-white border-0 rounded-xl shadow-none h-12 focus-visible:ring-0 pl-4" />
                    </div>
                    
                    <div>
                      <label htmlFor="eventType" className="block text-sm font-medium mb-2">
                        Tipo de evento
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="text-sm px-4 py-3 h-12 w-full flex items-center justify-between bg-white border-0 rounded-xl shadow-none focus-visible:ring-0 font-normal"
                          >
                            {eventType ? getSelectedEventTypeName() : "Selecciona el tipo de evento"}
                            <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          className="min-w-[225px] bg-white dark:bg-[#575654] border-none rounded-3xl p-3 shadow-none mb-2"
                          align="start"
                        >
                          {eventTypes.map((type) => (
                            <DropdownMenuItem
                              key={type.value}
                              className={cn(
                                "rounded-md px-3 py-3 text-sm font-medium mb-1 focus:bg-[#F8F8F8] hover:bg-[#F8F8F8] dark:text-white dark:focus:bg-[#444341] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300",
                                eventType === type.value && (
                                  "bg-[#F8F8F8] dark:bg-[#444341]"
                                )
                              )}
                              onClick={() => handleEventTypeSelect(type.value)}
                            >
                              {type.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-2">
                        Ubicación del evento
                      </label>
                      <Input id="location" type="text" placeholder="Sant Feliu de Codines" value={location} onChange={e => setLocation(e.target.value)} className="bg-white border-0 rounded-xl shadow-none h-12 focus-visible:ring-0 pl-4" />
                    </div>
                    
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium mb-2">
                        Duración del evento
                      </label>
                      <div className="py-2">
                        <div className="flex flex-wrap gap-2">
                          {durations.map((durationOption, index) => (
                            <motion.div 
                              key={index} 
                              whileHover={{
                                scale: 1.05
                              }} 
                              whileTap={{
                                scale: 0.95
                              }}
                            >
                              <Badge 
                                variant="default" 
                                className={`cursor-pointer px-4 py-2 bg-white hover:bg-gray-100 text-medium font-sm rounded-full flex items-center gap-1 h-10 relative overflow-hidden focus:ring-0 focus:ring-offset-0 ${selectedDuration === durationOption ? 'bg-gray-200 font-medium' : ''}`} 
                                onClick={(e) => {
                                  handleRippleEffect(e);
                                  handleDurationSelect(durationOption);
                                }}
                              >
                                {durationOption === "Personalizado" ? "Personalizado" : (
                                  <>
                                    <Clock className="h-4 w-4 mr-1" />
                                    {durationOption}
                                  </>
                                )}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {showCustomDuration && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: "auto" }} 
                          transition={{ duration: 0.2 }}
                        >
                          <Input id="customDuration" type="text" placeholder="Ej: 2 horas y 30 minutos" value={duration} onChange={e => setDuration(e.target.value)} className="bg-white border-0 rounded-xl shadow-none h-12 focus-visible:ring-0 pl-4 mt-2 w-full" />
                        </motion.div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Mensaje (opcional)
                      </label>
                      <Textarea id="message" placeholder="Escribe tu mensaje aquí..." value={message} onChange={e => setMessage(e.target.value)} className="bg-white border-0 rounded-xl shadow-none min-h-[120px] focus-visible:ring-0 pl-4 pt-4" />
                    </div>
                  </div>
                </ScrollArea>
                
                <div className={`flex justify-end mt-6 mb-4 ${isMobile ? 'sticky bottom-6 z-10 pt-4 bg-[#FAF8F6]' : ''}`}>
                  <Button className="bg-blue-100 hover:bg-blue-200 text-black font-medium rounded-full px-8" onClick={handleNextView}>
                    Siguiente
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="policies"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={pageVariants}
                className="w-full"
              >
                <ScrollArea className={`${isMobile ? 'h-[calc(70vh-280px)]' : 'h-[50vh]'} pr-2`}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-2">Políticas de contacto</h3>
                    
                    <div 
                      className={`bg-white rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all duration-200 relative overflow-hidden ${acceptedPolicies.contactTerms ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={(e) => {
                        handleRippleEffect(e);
                        handlePolicyDivClick('contactTerms');
                      }}
                    >
                      <div className="mt-1">
                        <Edit className="h-5 w-5 text-black" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <label 
                            htmlFor="contactTerms" 
                            className="font-semibold text-sm cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Acepto las condiciones de contacto
                          </label>
                          <div 
                            className={`h-5 w-5 border-2 border-black rounded flex items-center justify-center transition-all ${acceptedPolicies.contactTerms ? 'bg-black' : 'bg-white'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePolicyChange('contactTerms');
                            }}
                          >
                            {acceptedPolicies.contactTerms && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-2 w-2 bg-white"
                              />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          La mayoría de los músicos toman un descanso de 15 minutos 
                          después de 45 minutos de música, por lo que "2 horas de música" 
                          significa 2 sets de 45 minutos, con descansos.
                        </p>
                      </div>
                    </div>
                    
                    <div 
                      className={`bg-white rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all duration-200 relative overflow-hidden ${acceptedPolicies.privacyPolicy ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={(e) => {
                        handleRippleEffect(e);
                        handlePolicyDivClick('privacyPolicy');
                      }}
                    >
                      <div className="mt-1">
                        <BellRing className="h-5 w-5 text-black" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <label 
                            htmlFor="privacyPolicy" 
                            className="font-semibold text-sm cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Acepto las políticas de privacidad
                          </label>
                          <div 
                            className={`h-5 w-5 border-2 border-black rounded flex items-center justify-center transition-all ${acceptedPolicies.privacyPolicy ? 'bg-black' : 'bg-white'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePolicyChange('privacyPolicy');
                            }}
                          >
                            {acceptedPolicies.privacyPolicy && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-2 w-2 bg-white"
                              />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          La mayoría de los músicos toman un descanso de 15 minutos 
                          después de 45 minutos de música, por lo que "2 horas de música" 
                          significa 2 sets de 45 minutos, con descansos.
                        </p>
                      </div>
                    </div>
                    
                    <div 
                      className={`bg-white rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all duration-200 relative overflow-hidden ${acceptedPolicies.relatedArtists ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={(e) => {
                        handleRippleEffect(e);
                        handlePolicyDivClick('relatedArtists');
                      }}
                    >
                      <div className="mt-1">
                        <Users className="h-5 w-5 text-black" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <label 
                            htmlFor="relatedArtists" 
                            className="font-semibold text-sm cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Acepto recibir información sobre artistas relacionados
                          </label>
                          <div 
                            className={`h-5 w-5 border-2 border-black rounded flex items-center justify-center transition-all ${acceptedPolicies.relatedArtists ? 'bg-black' : 'bg-white'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePolicyChange('relatedArtists');
                            }}
                          >
                            {acceptedPolicies.relatedArtists && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-2 w-2 bg-white"
                              />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          La mayoría de los músicos toman un descanso de 15 minutos 
                          después de 45 minutos de música, por lo que "2 horas de música" 
                          significa 2 sets de 45 minutos, con descansos.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                
                <div className={`flex justify-between mt-6 mb-4 ${isMobile ? 'sticky bottom-6 z-10 pt-4 bg-[#FAF8F6]' : ''}`}>
                  <Button 
                    variant="secondary" 
                    className="bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-full px-8"
                    onClick={handlePreviousView}
                  >
                    Anterior
                  </Button>
                  <Button 
                    className="bg-blue-100 hover:bg-blue-200 text-black font-medium rounded-full px-8"
                    onClick={handleSubmit}
                    disabled={!acceptedPolicies.contactTerms || !acceptedPolicies.privacyPolicy}
                  >
                    Enviar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
      
      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        artistName={artistName}
        artistImage={artistImage}
      />
    </>
  );
};

export default ContactDialog;
