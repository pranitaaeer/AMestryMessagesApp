"use client"

import { Message } from "@/app/models/User.model"
import { isAcceptingMessagesSchema } from "@/app/Schemas/isAcceptingMessagesSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { useSession } from "next-auth/react"

import MessageCard from "@/components/MessageCard"

import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import {
  Loader2,
  Copy,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  Inbox,
} from "lucide-react"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const { data: session } = useSession()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof isAcceptingMessagesSchema>>({
    resolver: zodResolver(isAcceptingMessagesSchema),
    defaultValues: {
      isAcceptingMessages: true,
    },
  })

  const { watch, setValue } = form

  const isAcceptingMessages = watch("isAcceptingMessages")

  // --------------------------------
  // Fetch Accepting Messages Status
  // --------------------------------
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitching(true)

    try {
      const response = await axios.get("/api/toggle-message")

      setValue(
        "isAcceptingMessages",
        response.data?.isAcceptingMessages ?? false
      )
    } catch (error) {
      const axiosError = error as AxiosError

      toast({
        variant: "destructive",
        description: axiosError.message,
      })
    } finally {
      setIsSwitching(false)
    }
  }, [setValue, toast])

  // --------------------------------
  // Fetch Messages
  // --------------------------------
  const fetchMessages = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await axios.get("/api/get-messages")

      setMessages(response.data.messages || [])
    } catch (error) {
      const axiosError = error as AxiosError

      toast({
        variant: "destructive",
        description: axiosError.message,
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // --------------------------------
  // Toggle Accepting Messages
  // --------------------------------
  const toggleMessage = async () => {
    setIsSwitching(true)

    try {
      const newValue = !isAcceptingMessages

      const response = await axios.post("/api/toggle-message", {
        isAcceptingMessages: newValue,
      })

      setValue("isAcceptingMessages", newValue)

      toast({
        description: response.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError

      toast({
        variant: "destructive",
        description: axiosError.message,
      })
    } finally {
      setIsSwitching(false)
    }
  }

  // --------------------------------
  // Delete Message
  // --------------------------------
  const handleDeleteMessages = (messageid: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageid)
    )
  }

  // --------------------------------
  // Profile URL
  // --------------------------------
  const username = session?.user?.username

  const baseurl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : ""

  const profileUrl = username ? `${baseurl}/u/${username}` : ""

  // --------------------------------
  // Copy Profile URL
  // --------------------------------
  const copyToClipBoard = async () => {
    if (!profileUrl) return

    try {
      await navigator.clipboard.writeText(profileUrl)

      toast({
        description: "Profile URL copied to clipboard",
      })
    } catch {
      toast({
        variant: "destructive",
        description: "Failed to copy profile URL",
      })
    }
  }

  // --------------------------------
  // Initial Fetch
  // --------------------------------
  useEffect(() => {
    if (!session?.user) return

    fetchAcceptMessage()
    fetchMessages()
  }, [fetchAcceptMessage, fetchMessages, session])

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =========================
            HEADER
        ========================== */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {/* Header Glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                Your private space
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your anonymous messages, profile link and message
                receiving settings from one place.
              </p>
            </div>

            {/* Message Count */}
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Messages</p>
                <p className="text-xl font-bold text-white">
                  {messages.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            SETTINGS GRID
        ========================== */}
        <section className="mt-8 grid gap-5 lg:grid-cols-2">

          {/* Accept Messages */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.07]">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl transition-all duration-500 group-hover:bg-purple-500/20" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                      isAcceptingMessages
                        ? "bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20"
                        : "bg-white/10"
                    }`}
                  >
                    <Inbox className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">
                      Accepting Messages
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      Allow people to send anonymous messages to you.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  {isSwitching && (
                    <Loader2 className="absolute -left-7 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-purple-400" />
                  )}

                  <Switch
                    checked={isAcceptingMessages}
                    onCheckedChange={toggleMessage}
                    disabled={isSwitching}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500"
                  />
                </div>
              </div>

              <Separator className="my-5 bg-white/10" />

              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAcceptingMessages
                      ? "animate-pulse bg-emerald-400"
                      : "bg-slate-600"
                  }`}
                />

                <span
                  className={
                    isAcceptingMessages
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }
                >
                  {isAcceptingMessages
                    ? "You are accepting messages"
                    : "Message receiving is turned off"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Link */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/20 hover:bg-white/[0.07]">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20" />

            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/20">
                  <LinkIcon className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    Your Profile Link
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    Share this link to receive anonymous messages.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="truncate text-sm text-slate-400">
                    {profileUrl || "Generating profile link..."}
                  </p>
                </div>

                <Button
                  onClick={copyToClipBoard}
                  disabled={!profileUrl}
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.08] text-slate-300 hover:bg-purple-500/20 hover:text-purple-300"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            MESSAGES
        ========================== */}
        <section className="mt-10">

          {/* Section Header */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-purple-400">
                Inbox
              </p>

              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                Your Messages
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Anonymous messages sent to your profile appear here.
              </p>
            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                </div>

                <p className="text-sm text-slate-500">
                  Loading your messages...
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            /* Empty State */
            <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <div className="absolute h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative px-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <Inbox className="h-7 w-7 text-purple-400" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  No messages yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Once someone sends you an anonymous message, it will appear
                  here.
                </p>
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessages}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default Page

