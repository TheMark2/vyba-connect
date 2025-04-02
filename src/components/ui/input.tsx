import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = useCombinedRefs(ref, inputRef)

    return (
      <div className="relative">
        <input
          {...props}
          className={cn(
            "flex h-14 w-full rounded-lg bg-[#F7F7F7] px-5 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus:ring-[#666666] focus:ring-4 transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-black font-medium placeholder:font-medium placeholder:text-muted-foreground dark:text-white dark:bg-[#F7F7F7] dark:placeholder:text-gray-400",
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
