
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

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

  return !!isMobile
}
