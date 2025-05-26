"use client"
import { z } from "zod"
import React, { useState } from 'react'
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { SignInSchema } from "@/app/Schemas/SignInSchema"
import { signIn } from "next-auth/react"

const Page = () => {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifiers: "",
      password: ""
    },
  })
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(data: z.infer<typeof SignInSchema>) {
    setIsSubmiting(true)
    const response = await signIn('credentials', {
      identifiers: data.identifiers,
      password: data.password,
      redirect: false,
    })

    if (response?.error) {
      toast({
        title: "Sign In error",
        description: response.error || "incorrect username or password",
        variant: "destructive"
      })
    } else if (response?.ok) {
      router.replace(`/dashboard`)
    }
    setIsSubmiting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-2 text-primary">Sign In</h2>
        <p className="text-center text-muted-foreground mb-6 text-sm">
          Welcome back! Please sign in to your account.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="identifiers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email or username" autoComplete="off" {...field} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" type="password" autoComplete="off" {...field} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmiting} className="w-full">
              {isSubmiting ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Dont have an account?{" "}
          <Link href="/sign-up" className="text-primary underline hover:text-primary/80">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page