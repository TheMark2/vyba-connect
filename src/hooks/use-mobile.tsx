
import * as React from "react"

// Ajustamos los breakpoints para que las columnas se reduzcan más rápido
const MOBILE_BREAKPOINT = 768
const SMALL_MOBILE_BREAKPOINT = 550 // Aumentamos este valor para hacer que pase a 1 columna antes

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth < MOBILE_BREAKPOINT);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Establecer el valor inicial
    onChange()
    
    // Añadir el listener para cambios de tamaño
    mql.addEventListener("change", onChange)
    
    // Limpieza al desmontar el componente
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

export function useIsSmallMobile() {
  const [isSmallMobile, setIsSmallMobile] = React.useState<boolean>(window.innerWidth < SMALL_MOBILE_BREAKPOINT);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${SMALL_MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsSmallMobile(window.innerWidth < SMALL_MOBILE_BREAKPOINT)
    }
    
    // Establecer el valor inicial
    onChange()
    
    // Añadir el listener para cambios de tamaño
    mql.addEventListener("change", onChange)
    
    // Limpieza al desmontar el componente
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isSmallMobile
}
