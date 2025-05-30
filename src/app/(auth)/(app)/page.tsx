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
      <div className="max-w-2xl mx-auto  p-6 bg-white/90 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-2">
          Welcome{user ? `, ${user.username || user.email}` : ""}!
        </h2>
        <p className="text-muted-foreground">
          {user
            ? "You are logged in. Here you can manage your messages."
            : "Please log in to access your dashboard."}
        </p>
      </div>
      <div className="flex justify-center mt-8">
        <Carousel ref={emblaRef} className="w-full max-w-xs">
          <CarouselContent>
            {data.map((item, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <span className=" text-xl font-bold mb-2"><h1>{item.title}</h1></span>
                    <span className="text-base mb-2"><h3>{item.content}</h3></span>
                    <span className="text-xs text-muted-foreground">By {item.user}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default Home