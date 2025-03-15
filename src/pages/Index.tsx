import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";

// Custom Animated Input component
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Combine refs
    const combinedRef = React.useCallback(
      (element: HTMLInputElement | null) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(element);
          } else {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
          }
        }
        inputRef.current = element;
      },
      [ref]
    );

    React.useEffect(() => {
      if (inputRef.current && inputRef.current.value) {
        setHasValue(true);
      } else {
        setHasValue(false);
      }
    }, [props.value]);

    const shouldFloatLabel = isFocused || hasValue;

    return (
      <div className="relative w-full">
        {props.placeholder && (
          <span
            className={cn(
              "absolute pointer-events-none transition-all duration-300 text-muted-foreground font-bold",
              shouldFloatLabel 
                ? "transform -translate-y-2 text-xs left-3 top-2" 
                : "transform translate-y-0 text-base left-3 top-4"
            )}
          >
            {props.placeholder}
          </span>
        )}
        <input
          {...props}
          placeholder=""
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pt-6",
            className
          )}
          ref={combinedRef}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            props.onChange && props.onChange(e);
          }}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

const Index = () => {
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    scrollYProgress
  } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  const artists = [{
    type: "DJ",
    image: "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
    description: "El portal perfecto para encontrar tu DJ"
  }, {
    type: "Saxofonista",
    image: "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
    description: "Encuentra al saxofonista ideal para tu evento"
  }, {
    type: "Guitarrista",
    image: "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
    description: "Conecta con talentosos guitarristas"
  }];

  // Transiciones de opacidad mejoradas con valores más optimizados
  const opacity1 = useTransform(scrollYProgress, [0, 0.19, 0.25, 0.3], [1, 0.9, 0.3, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.19, 0.25, 0.3, 0.43, 0.5, 0.55], [0, 0.3, 0.9, 1, 0.3, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.43, 0.5, 0.55, 1], [0, 0.3, 1, 1]);

  // Efectos de escala refinados para las imágenes
  const scale1 = useTransform(scrollYProgress, [0, 0.19, 0.25], [1, 1.05, 1.1]);
  const scale2 = useTransform(scrollYProgress, [0.19, 0.25, 0.45, 0.5], [0.95, 1, 1.05, 1.1]);
  const scale3 = useTransform(scrollYProgress, [0.45, 0.5, 0.7], [0.95, 1, 1.05]);

  // Efectos de movimiento paralaje para las imágenes - más sutiles
  const moveY1 = useTransform(scrollYProgress, [0, 0.25], ["0%", "-3%"]);
  const moveY2 = useTransform(scrollYProgress, [0.25, 0.5], ["0%", "-3%"]);
  const moveY3 = useTransform(scrollYProgress, [0.5, 0.75], ["0%", "-3%"]);

  // Movimiento sutil en el eje X para dar profundidad
  const moveX1 = useTransform(scrollYProgress, [0, 0.25], ["0%", "1%"]);
  const moveX2 = useTransform(scrollYProgress, [0.25, 0.5], ["0%", "-1%"]);
  const moveX3 = useTransform(scrollYProgress, [0.5, 0.75], ["0%", "1%"]);

  // Transiciones para los tres textos
  const textOpacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 0.3, 0]);
  const textOpacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45], [0, 1, 0]);
  const textOpacity3 = useTransform(scrollYProgress, [0.45, 0.55, 1], [0, 1, 1]);

  return <div className="min-h-screen flex flex-col p-0 m-0">
      <div className="w-full">
        <Navbar className="mx-auto" />
      </div>

      <main className="flex-1">
        {/* Sección de scroll animado */}
        <div ref={scrollRef} className="h-[300vh] relative">
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="relative w-full h-screen overflow-hidden">
              <motion.div className="absolute inset-0 px-6 md:px-10 lg:px-14 xl:px-16 pt-8 pb-32">
                <motion.div className="relative w-full h-full rounded-[2vw] overflow-hidden">
                  {/* DJ image layer */}
                  <motion.div className="absolute inset-0 origin-center" style={{
                  opacity: opacity1,
                  scale: scale1,
                  y: moveY1,
                  x: moveX1
                }}>
                    <img src={artists[0].image} alt="DJ performing" className="w-full h-full brightness-75 blur-[2px] object-cover" />
                  </motion.div>
                  
                  {/* Saxofonista image layer */}
                  <motion.div className="absolute inset-0 origin-center" style={{
                  opacity: opacity2,
                  scale: scale2,
                  y: moveY2,
                  x: moveX2
                }}>
                    <img src={artists[1].image} alt="Saxofonista performing" className="w-full h-full brightness-75 blur-[2px] object-cover" />
                  </motion.div>
                  
                  {/* Guitarrista image layer - sin padding */}
                  <motion.div className="absolute inset-0 origin-center" style={{
                  opacity: opacity3,
                  scale: scale3,
                  y: moveY3,
                  x: moveX3
                }}>
                    <img src={artists[2].image} alt="Guitarrista performing" className="w-full h-full brightness-75 blur-[2px] object-cover rounded-[2vw]" />
                  </motion.div>

                  {/* Background overlay */}
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                  
                  {/* Content */}
                  <motion.div className="absolute inset-0 flex flex-col justify-center text-white px-6 md:px-12 lg:px-16">
                    <div className="max-w-2xl mx-0 space-y-14">
                      <div className="relative h-28">
                        {/* Texto 1: Contacta con los mejores artistas */}
                        <motion.h1 
                          className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight absolute top-0 left-0 w-full" 
                          style={{ opacity: textOpacity1 }}
                        >
                          Contacta con los mejores artistas
                        </motion.h1>
                        
                        {/* Texto 2: De una forma fácil */}
                        <motion.h1 
                          className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight absolute top-0 left-0 w-full" 
                          style={{ opacity: textOpacity2 }}
                        >
                          De una forma fácil
                        </motion.h1>
                        
                        {/* Texto 3: Usa Vyba */}
                        <motion.h1 
                          className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight absolute top-0 left-0 w-full" 
                          style={{ opacity: textOpacity3 }}
                        >
                          Usa Vyba
                        </motion.h1>
                      </div>
                      
                      <motion.div className="flex w-full relative">
                        <div className="relative w-full flex items-center">
                          <Input 
                            type="text" 
                            placeholder="Buscar artistas" 
                            className="pr-14 bg-[#F5F1EB] text-black h-14 rounded-full border-0" 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                          />
                          <Button type="submit" size="icon" className="absolute right-2 rounded-full h-11 w-11 flex items-center justify-center">
                            <Search className="h-5 w-5" />
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Nueva sección debajo de la animación scroll */}
        <section className="py-24 bg-vyba-cream">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Imagen a la izquierda en móvil, derecha en desktop */}
              <div className="md:order-2">
                <img src="/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png" alt="DJ en concierto" className="w-full h-auto rounded-2xl shadow-lg object-cover aspect-[4/3]" />
              </div>
              
              {/* Contenido de texto */}
              <div className="md:order-1">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-vyba-navy">
                  No te ralles, usa Vyba
                </h2>
                
                <div className="flex w-full relative max-w-lg mb-8">
                  <div className="relative w-full flex items-center">
                    <Input 
                      type="text" 
                      placeholder="Buscar artistas" 
                      className="pr-16 bg-white text-black h-14 rounded-full border-0" 
                    />
                    <Button type="submit" size="icon" className="absolute right-1 rounded-full h-12 w-12 flex items-center justify-center">
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};

export default Index;