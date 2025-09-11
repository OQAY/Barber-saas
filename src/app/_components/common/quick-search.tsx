"use client"

import { Button } from "@/app/_components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { quickSearchOptions } from "@/app/_constants/search"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"

const QuickSearch = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })

      setTimeout(checkScroll, 300)
    }
  }

  // Mouse drag functionality - simplified and more reactive
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setHasDragged(false)
    setStartX(e.pageX)
    setScrollLeft(scrollRef.current.scrollLeft)
    scrollRef.current.style.cursor = "grabbing"
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab"
    }
    // Reset after a short delay to allow click to be processed
    setTimeout(() => setHasDragged(false), 100)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX
    const distance = startX - x
    
    // Only consider it a drag if moved more than 5 pixels
    if (Math.abs(distance) > 5) {
      setHasDragged(true)
      scrollRef.current.scrollLeft = scrollLeft + distance
      checkScroll()
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setHasDragged(false)
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab"
    }
  }
  
  const handleLinkClick = (e: React.MouseEvent) => {
    // Prevent navigation if user dragged
    if (hasDragged) {
      e.preventDefault()
    }
  }

  return (
    <div className="relative mt-6 px-2">
      {/* Desktop: Botão Esquerda */}
      <Button
        variant="outline"
        size="icon"
        className={`absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background shadow-lg transition-opacity md:flex ${
          canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Container de Categorias */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden md:cursor-grab"
        onScroll={checkScroll}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {quickSearchOptions.map((option) => (
          <Button
            className="gap-2 flex-shrink-0"
            variant="secondary"
            key={option.title}
            asChild
          >
            <Link 
              href={`/barbers?service=${option.title}`}
              draggable={false}
              onClick={handleLinkClick}
            >
              <Image
                src={option.imageUrl}
                width={16}
                height={16}
                alt={option.title}
                draggable={false}
              />
              {option.title}
            </Link>
          </Button>
        ))}
      </div>

      {/* Desktop: Botão Direita */}
      <Button
        variant="outline"
        size="icon"
        className={`absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background shadow-lg transition-opacity md:flex ${
          canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default QuickSearch