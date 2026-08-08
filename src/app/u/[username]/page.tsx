"use client"

import { messageSchema } from "@/app/Schemas/messageSchema"
import { ApiResponse } from "@/app/types/ApiResponse"
import { useToast } from "@/hooks/use-toast"

import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"

import { useParams } from "next/navigation"
import React, { useState } from "react"

import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  MessageSquare,
  Send,
  Sparkles,
  Loader2,
} from "lucide-react"

const Page = () => {
  const params = useParams<{ username: string }>()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  async function onSubmit(
    data: z.infer<typeof messageSchema>
  ) {
    setIsSubmitting(true)

    try {
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
      })

      toast({
        title: "Message Sent ✨",
        description: response.data.message,
      })

      // Clear input after successful message
      form.reset()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: "Message Error",
        description:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Something went wrong while sending your message.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6">

      {/* =========================
          Background Glow
      ========================== */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />
      </div>

      {/* =========================
          Main Card
      ========================== */}
      <div className="relative w-full max-w-2xl">

        {/* Glow behind card */}
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-pink-500/20 blur-xl" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-2xl backdrop-blur-xl">

          {/* Top Gradient */}
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />

          <div className="p-6 sm:p-8 md:p-10">

            {/* =========================
                Header
            ========================== */}
            <div className="text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-xl shadow-purple-500/20">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                Anonymous Message
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Send a Message
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                Send an anonymous message. Your identity will remain
                private.
              </p>
            </div>

            {/* =========================
                Divider
            ========================== */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* =========================
                Form
            ========================== */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-2 block text-sm font-medium text-slate-200">
                        Your Message
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Write something anonymously..."
                          autoComplete="off"
                          disabled={isSubmitting}
                          {...field}
                          className="h-14 rounded-xl border-white/10 bg-black/20 px-4 text-white placeholder:text-slate-600 transition-all duration-300 focus:border-purple-400/40 focus:bg-black/30 focus:ring-2 focus:ring-purple-500/10"
                        />
                      </FormControl>

                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01] hover:from-purple-400 hover:to-blue-400 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* =========================
                Privacy Note
            ========================== */}
            <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-center">
              <p className="text-xs leading-5 text-slate-500">
                🔒 Your message is anonymous and your identity is not
                shared with the recipient.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
