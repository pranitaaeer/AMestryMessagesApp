
"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Card, CardContent } from "@/components/ui/card"
import data from "./data.json"

const Home = () => {
  const { data: session } = useSession()
  const user = session?.user

  const [emblaApi, setEmblaApi] = useState<any>(null)

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }, 2500)

    return () => clearInterval(autoplay)
  }, [emblaApi])

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Decorative gradient */}
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
              ✨ Welcome to your dashboard
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Welcome
              {user
                ? `, ${user.name || user.email?.split("@")[0]}`
                : ""}
              <span className="ml-2">👋</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              {user
                ? "You are logged in. Here you can manage your messages and explore what’s happening in your community."
                : "Please log in to access your dashboard and manage your messages."}
            </p>

            {user && (
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs text-slate-500">Account</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Active
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Messages Section */}
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-purple-400">
                Community
              </p>

              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                Latest Messages
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Discover the latest messages from the community.
              </p>
            </div>
          </div>

          <Carousel
            setApi={setEmblaApi}
            opts={{
              loop: true,
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {data.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group h-full overflow-hidden border-white/10 bg-white/[0.05] text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/[0.08] hover:shadow-purple-500/10">
                    <CardContent className="flex h-full flex-col p-6">
                      {/* Number */}
                      <div className="mb-5 flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold shadow-lg shadow-purple-500/20">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                          Message
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="line-clamp-2 text-xl font-semibold transition-colors group-hover:text-purple-300">
                          {item.title}
                        </h3>

                        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
                          {item.content}
                        </p>
                      </div>

                      {/* User */}
                      <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold">
                          {item.user?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Posted by
                          </p>
                          <p className="text-sm font-medium text-slate-200">
                            {item.user}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel Controls */}
            <div className="mt-6 flex justify-end gap-2">
              <CarouselPrevious className="static translate-y-0 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white" />
              <CarouselNext className="static translate-y-0 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white" />
            </div>
          </Carousel>
        </section>
      </div>
    </main>
  )
}

export default Home

