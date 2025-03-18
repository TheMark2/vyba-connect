import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Orientation = "horizontal" | "vertical"

export interface CarouselProps {
  opts?: Omit<
    React.ComponentProps<typeof useEmblaCarousel>["options"],
    "axis"
  >
  plugins?: React.ComponentProps<typeof useEmblaCarousel>["plugins"]
  orientation?: Orientation
  onSlideChange?: (index: number) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
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
    const [currentIndex, setCurrentIndex] = React.useState(0)

    React.useEffect(() => {
      if (!api) {
        return
      }

      if (onSlideChange) {
        onSlideChange(currentIndex)
      }
    }, [currentIndex, onSlideChange])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const onSelect = React.useCallback(() => {
      if (!api) {
        return
      }

      setCurrentIndex(api.selectedScrollSnap())
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [api])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect()
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

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
  return (
    <div
      ref={ref}
      className={cn("relative flex-[0_0_auto]", className)}
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
      <ArrowLeftIcon className="h-4 w-4" />
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
      <ArrowRightIcon className="h-4 w-4" />
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
