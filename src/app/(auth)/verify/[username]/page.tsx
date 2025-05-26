"use client"
import { z } from "zod"
import React, { useState } from 'react'
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from "axios"
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
import { verifyCodeSchema } from "@/app/Schemas/verifySchema"
import { ApiResponse } from "@/app/types/ApiResponse"

const Page = () => {
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  })
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const Params = useParams<{ username: string }>()

  async function onSubmit(data: z.infer<typeof verifyCodeSchema>) {
    setIsSubmiting(true)
    try {
      const response = await axios.post(`/api/verify-user`, {
        username: Params.username,
        code: data.code
      })
      console.log("username:",Params.username)
      toast({
        title: "Verify user",
        description: response.data.message
      })
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Verify User Error",
        description: axiosError.message,
        variant: "destructive"
      })
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-2 text-primary">Verify Your Account</h2>
        <p className="text-center text-muted-foreground mb-6 text-sm">
          Enter the verification code sent to your email.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter code" autoComplete="off" {...field} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmiting} className="w-full">
              {isSubmiting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page