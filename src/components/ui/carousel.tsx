
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

interface CarouselProps {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  onSlideChange?: (index: number) => void
  onScroll?: () => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollSnaps: number[]
  onSlideChange?: (index: number) => void
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      plugins,
      className,
      children,
      onSlideChange,
      setApi,
      onScroll,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

    // Set API for external use
    React.useEffect(() => {
      if (api && setApi) {
        setApi(api)
      }
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      if (onSlideChange) {
        onSlideChange(selectedIndex)
      }
    }, [api, selectedIndex, onSlideChange])

    // Scroll to functions
    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleScroll = React.useCallback(() => {
      if (!api || !onScroll) return
      onScroll()
    }, [api, onScroll])

    // Handle API changes
    const onSelect = React.useCallback(() => {
      if (!api) {
        return
      }

      setSelectedIndex(api.selectedScrollSnap())
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [api])

    // Get the scroll snap positions
    React.useEffect(() => {
      if (!api) return
      
      setScrollSnaps(api.scrollSnapList())
      
      onSelect()
      api.on("reInit", onSelect)
      api.on("select", onSelect)
      
      if (onScroll) {
        api.on("scroll", handleScroll)
      }

      return () => {
        api.off("select", onSelect)
        if (onScroll) {
          api.off("scroll", handleScroll)
        }
      }
    }, [api, onSelect, handleScroll, onScroll])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          scrollSnaps,
          onSlideChange,
        }}
      >
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)

Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel()

  return (
    <div className="overflow-hidden" ref={carouselRef}>
      <div className={cn("flex touch-pan-y", className)} {...props} />
    </div>
  )
})

CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { selectedIndex, scrollSnaps } = useCarousel()
  const itemRef = React.useRef<HTMLDivElement>(null)
  const [index, setIndex] = React.useState<number>(-1)
  
  // Determinar el índice del elemento actual
  React.useEffect(() => {
    // Encontrar todos los elementos CarouselItem
    if (!itemRef.current) return
    
    const parent = itemRef.current.parentElement
    if (!parent) return
    
    const items = Array.from(parent.children)
    const currentIndex = items.indexOf(itemRef.current)
    
    setIndex(currentIndex)
  }, [])
  
  // Calcular si este elemento es el seleccionado
  const isSelected = index === selectedIndex
  
  // Calcular la distancia al elemento seleccionado
  let distance = 0
  if (index !== -1 && selectedIndex !== -1) {
    distance = Math.abs(index - selectedIndex)
  }
  
  // Ajustar tamaño y opacidad basado en la distancia
  let scale = 1
  let opacity = 1
  let zIndex = 10
  
  if (distance > 0) {
    scale = Math.max(0.8, 1 - distance * 0.1)
    opacity = Math.max(0.5, 1 - distance * 0.2)
    zIndex = 10 - distance
  }
  
  const transform = isSelected ? "scale(1.1)" : `scale(${scale})`
  
  return (
    <div
      ref={(node) => {
        // Combine the refs
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
        itemRef.current = node
      }}
      className={cn(
        "relative flex-[0_0_auto] transition-all duration-300",
        className
      )}
      style={{
        transform,
        opacity,
        zIndex
      }}
      {...props}
    />
  )
})

CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { canScrollPrev, scrollPrev } = useCarousel()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-75 hover:opacity-100 disabled:opacity-25",
        className
      )}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      aria-label="Go to previous slide"
      ref={ref}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})

CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { canScrollNext, scrollNext } = useCarousel()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-75 hover:opacity-100 disabled:opacity-25",
        className
      )}
      onClick={scrollNext}
      disabled={!canScrollNext}
      aria-label="Go to next slide"
      ref={ref}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})

CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
}
