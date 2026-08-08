"use client"

import axios, { AxiosError } from "axios"
import { z } from "zod"
import React, { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from "usehooks-ts"

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

import { SignupSchema } from "@/app/Schemas/SignupSchema"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import {
  UserRound,
  Mail,
  LockKeyhole,
  UserPlus,
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react"

const Page = () => {
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),

    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const debouncedUsername = useDebounceCallback(
    setUsername,
    500
  )

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!username) {
        setUsernameMessage("")
        return
      }

      setIsLoading(true)
      setUsernameMessage("")

      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        )

        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError

        setUsernameMessage(
          axiosError.message || "Unable to check username"
        )
      } finally {
        setIsLoading(false)
      }
    }

    checkUsername()
  }, [username])

  // Submit
  async function onSubmit(
    data: z.infer<typeof SignupSchema>
  ) {
    setIsSubmitting(true)

    try {
      const response = await axios.post(
        "/api/sign-up",
        data
      )

      toast({
        title: "Account Created ✨",
        description: response.data.message,
      })

      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string
      }>

      toast({
        title: "Sign Up Error",
        description:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Something went wrong while creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const usernameAvailable =
    usernameMessage.toLowerCase() === "username is unique"

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
          Signup Container
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
                <UserPlus className="h-7 w-7 text-white" />
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                Join the community
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Create your account
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Sign up to get started and create your
                anonymous messaging profile.
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

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>

                      <FormLabel className="text-sm font-medium text-slate-200">
                        Username
                      </FormLabel>

                      <FormControl>
                        <div className="relative">

                          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                          <Input
                            placeholder="Enter username"
                            autoComplete="username"
                            disabled={isSubmitting}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              debouncedUsername(
                                e.target.value
                              )
                            }}
                            className="h-12 rounded-xl border-white/10 bg-black/20 pl-11 pr-11 text-white placeholder:text-slate-600 transition-all duration-300 focus:border-purple-400/40 focus:bg-black/30 focus:ring-2 focus:ring-purple-500/10"
                          />

                          {/* Username Status Icon */}
                          {username && !isLoading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {usernameAvailable ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400" />
                              )}
                            </div>
                          )}

                          {isLoading && (
                            <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-purple-400" />
                          )}

                        </div>
                      </FormControl>

                      {/* Username Availability */}
                      {username && (
                        <div className="mt-2 flex items-center gap-1.5">

                          {isLoading ? (
                            <p className="text-xs text-purple-400">
                              Checking username...
                            </p>
                          ) : (
                            <p
                              className={`text-xs ${
                                usernameAvailable
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {usernameMessage}
                            </p>
                          )}

                        </div>
                      )}

                      <FormMessage className="text-xs text-red-400" />

                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>

                      <FormLabel className="text-sm font-medium text-slate-200">
                        Email
                      </FormLabel>

                      <FormControl>
                        <div className="relative">

                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                          <Input
                            placeholder="Enter your email"
                            type="email"
                            autoComplete="email"
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
                            placeholder="Create a password"
                            type="password"
                            autoComplete="new-password"
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
                      Signing Up...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </>
                  )}
                </Button>

              </form>
            </Form>

            {/* =========================
                Sign In
            ========================== */}
            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}

                <Link
                  href="/sign-in"
                  className="font-semibold text-purple-400 transition-colors hover:text-purple-300"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Privacy */}
            <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-center">
              <p className="text-xs leading-5 text-slate-600">
                🔒 Your account information is securely
                protected.
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
