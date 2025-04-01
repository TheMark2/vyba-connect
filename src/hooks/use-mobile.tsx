
import * as React from "react"

// Ajustamos los breakpoints para una mejor detección de dispositivos móviles
const MOBILE_BREAKPOINT = 768
const SMALL_MOBILE_BREAKPOINT = 550

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Establecer el valor inicial
    handleResize()
    
    // Añadir el listener para cambios de tamaño
    window.addEventListener("resize", handleResize)
    
    // Limpieza al desmontar el componente
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

export function useIsSmallMobile() {
  const [isSmallMobile, setIsSmallMobile] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < SMALL_MOBILE_BREAKPOINT : false
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      setIsSmallMobile(window.innerWidth < SMALL_MOBILE_BREAKPOINT)
    }
    
    // Establecer el valor inicial
    handleResize()
    
    // Añadir el listener para cambios de tamaño
    window.addEventListener("resize", handleResize)
    
    // Limpieza al desmontar el componente
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isSmallMobile
}
