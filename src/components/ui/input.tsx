
import * as React from "react"
import { cn } from "@/lib/utils"

// Definimos un tipo para los estados de verificación del email
type VerificationStatus = 'verified' | 'not-registered' | 'google' | false;

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { 
  showVerified?: VerificationStatus;
  error?: boolean;
}>(
  ({ className, type, showVerified = false, error = false, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = useCombinedRefs(ref, inputRef)

    return (
      <div className="relative">
        <input
          {...props}
          type={type}
          className={cn(
            "flex h-12 w-full rounded-lg bg-[#F7F7F7] px-5 py-2 text-base md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus:ring-[#666666] focus:ring-2 transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 text-black font-medium placeholder:font-medium placeholder:text-muted-foreground dark:text-white dark:bg-[#F7F7F7] dark:placeholder:text-gray-400",
            showVerified && "pr-12",
            error && "ring-2 ring-[#C13515] focus:ring-[#C13515]",
            className
          )}
          ref={combinedRef}
        />
        {showVerified === 'verified' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 transition-opacity duration-300 opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="m22 11-2 2-2-2" />
              <path d="M16 11h4" />
            </svg>
          </div>
        )}
        {showVerified === 'not-registered' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#EADBDB] ring-2 ring-[#EADBDB] rounded-full w-5 h-5 flex items-center justify-center transition-opacity duration-300 opacity-100">
            <div className="bg-[#ea384c] rounded-full w-2 h-2"></div>
          </div>
        )}
        {showVerified === 'google' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 transition-opacity duration-300 opacity-100">
            <img src="/logos/google-logo.svg" alt="Google" width={16} height={16} />
          </div>
        )}
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
