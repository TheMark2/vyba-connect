
import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ className, onChange, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = useCombinedRefs(ref, inputRef)
    const isMobile = useIsMobile()
    const [internalValue, setInternalValue] = React.useState<string>("")
    const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null)
    
    // Inicializamos el valor interno cuando cambian props
    React.useEffect(() => {
      if (props.value !== undefined) {
        setInternalValue(props.value as string)
      }
    }, [props.value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      
      // Siempre actualizamos el valor interno inmediatamente para UX
      setInternalValue(newValue)

      // En móvil usamos debounce para reducir renders
      if (isMobile && onChange) {
        // Limpiamos el timeout anterior si existe
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current)
        }
        
        // Establecemos un nuevo timeout
        debounceTimeout.current = setTimeout(() => {
          const event = Object.create(e)
          event.target = { ...e.target, value: newValue }
          onChange(event)
        }, 300) // 300ms debounce
      } 
      // En desktop mantenemos el comportamiento normal
      else if (onChange) {
        onChange(e)
      }
    }

    // Limpiamos el timeout cuando se desmonta
    React.useEffect(() => {
      return () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current)
        }
      }
    }, [])

    // Para mantener el valor visualmente actualizado mientras se escribe
    const displayValue = internalValue !== undefined && isMobile ? 
      internalValue : props.value

    return (
      <div className="relative">
        <input
          {...props}
          value={displayValue}
          onChange={handleChange}
          className={cn(
            "flex h-12 w-full rounded-md bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-black font-medium placeholder:font-medium placeholder:text-muted-foreground dark:text-white dark:bg-black dark:placeholder:text-gray-400 placeholder:text-sm",
            className
          )}
          ref={combinedRef}
        />
      </div>
    )
  }
)

// Helper function to combine refs
function useCombinedRefs<T>(
  ...refs: Array<React.Ref<T> | null | undefined>
): React.RefCallback<T> {
  return React.useCallback((element: T) => {
    refs.forEach((ref) => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(element)
      } else {
        (ref as React.MutableRefObject<T>).current = element
      }
    })
  }, [refs])
}

Input.displayName = "Input"
export { Input }
