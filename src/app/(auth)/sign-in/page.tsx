"use client"

import { z } from "zod"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import Link from "next/link"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import { useToast } from "@/hooks/use-toast"
import { SignInSchema } from "@/app/Schemas/SignInSchema"
import { signIn } from "next-auth/react"

import {
  LockKeyhole,
  LogIn,
  Loader2,
  Sparkles,
  UserRound,
} from "lucide-react"

const Page = () => {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),

    defaultValues: {
      identifiers: "",
      password: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(
    data: z.infer<typeof SignInSchema>
  ) {
    setIsSubmitting(true)

    try {
      const response = await signIn("credentials", {
        identifiers: data.identifiers,
        password: data.password,
        redirect: false,
      })

      if (response?.error) {
        toast({
          title: "Sign In Error",
          description:
            response.error ||
            "Incorrect username or password.",
          variant: "destructive",
        })
      } else if (response?.ok) {
        toast({
          title: "Welcome back! ✨",
          description: "You have successfully signed in.",
        })

        router.replace("/dashboard")
      }
    } catch {
      toast({
        title: "Sign In Error",
        description: "Something went wrong. Please try again.",
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

        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />
      </div>

      {/* =========================
          Login Container
      ========================== */}
      <div className="relative w-full max-w-md">

        {/* Outer Glow */}
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-pink-500/20 blur-xl" />

        {/* Card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-2xl backdrop-blur-xl">

          {/* Gradient Top Border */}
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />

          <div className="p-6 sm:p-8">

            {/* =========================
                Header
            ========================== */}
            <div className="text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-xl shadow-purple-500/20">
                <LogIn className="h-7 w-7 text-white" />
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                Welcome back
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Sign In
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Welcome back! Sign in to manage your messages
                and access your dashboard.
              </p>
            </div>

            {/* Divider */}
            <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* =========================
                Form
            ========================== */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >

                {/* Identifier */}
                <FormField
                  control={form.control}
                  name="identifiers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-200">
                        Email or Username
                      </FormLabel>

                      <FormControl>
                        <div className="relative">
                          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                          <Input
                            placeholder="Enter email or username"
                            autoComplete="username"
                            disabled={isSubmitting}
                            {...field}
                            className="h-12 rounded-xl border-white/10 bg-black/20 pl-11 text-white placeholder:text-slate-600 transition-all duration-300 focus:border-purple-400/40 focus:bg-black/30 focus:ring-2 focus:ring-purple-500/10"
                          />
                        </div>
                      </FormControl>

                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-200">
                        Password
                      </FormLabel>

                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                          <Input
                            placeholder="Enter your password"
                            type="password"
                            autoComplete="current-password"
                            disabled={isSubmitting}
                            {...field}
                            className="h-12 rounded-xl border-white/10 bg-black/20 pl-11 text-white placeholder:text-slate-600 transition-all duration-300 focus:border-purple-400/40 focus:bg-black/30 focus:ring-2 focus:ring-purple-500/10"
                          />
                        </div>
                      </FormControl>

                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01] hover:from-purple-400 hover:to-blue-400 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* =========================
                Sign Up
            ========================== */}
            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                Don &apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-purple-400 transition-colors hover:text-purple-300"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Privacy */}
            <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-center">
              <p className="text-xs text-slate-600">
                🔒 Your account information is securely protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
