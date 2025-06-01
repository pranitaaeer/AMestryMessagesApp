"use client"
import React, { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card'
import useEmblaCarousel from 'embla-carousel-react'
import data from './data.json'

const Home = () => {
  const { data: session } = useSession()
  const user = session?.user as User

  // Autoplay logic
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!emblaApi) return
    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext()
    }, 2500)
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [emblaApi])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 gap-12 overflow-hidden">
      <div className="max-w-2xl mx-auto p-6 bg-white/90 rounded-xl shadow-lg">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          Welcome{user ? `, ${user.username || user.email}` : ""}!
        </h2>
        <p className="text-muted-foreground mb-4">
          {user
            ? "You are logged in. Here you can manage your messages."
            : "Please log in to access your dashboard."}
        </p>
      </div>
      <div className="flex justify-center mt-8">
        <Carousel ref={emblaRef} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <CarouselContent>
            {data.map((item, index) => (
              <CarouselItem key={index}>
                <Card className="aspect-square flex items-center justify-center">
                  <CardContent className="flex flex-col items-center justify-center h-full w-full p-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">{item.title}</h1>
                    <h3 className="text-lg md:text-xl mb-2 text-center">{item.content}</h3>
                    <span className="text-sm md:text-base text-muted-foreground text-center">By {item.user}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>
      <style jsx global>{`
        .embla__slide {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

export default Home