"use client"
import axios, { AxiosError } from "axios"
import { z } from "zod"
import React, { useEffect, useState } from 'react'
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
import { SignupSchema } from "@/app/Schemas/SignupSchema"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/app/types/ApiResponse"
import { useRouter } from "next/navigation"

const Page = () => {
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
  })
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMeassage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const debouncedUsername = useDebounceCallback(setUsername, 500)

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsLoading(true)
        setUsernameMeassage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMeassage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMeassage(axiosError.message)
        } finally {
          setIsLoading(false)
        }
      }
    }
    checkUsername()
  }, [username])

  async function onSubmit(data: z.infer<typeof SignupSchema>) {
    setIsSubmiting(true)
    try {
      const response = await axios.post('/api/sign-up', data)
      toast({
        title: "Sign Up",
        description: response.data.message
      })
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Sign Up",
        description: axiosError.message
      })
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-2 text-primary">Create your account</h2>
        <p className="text-center text-muted-foreground mb-6 text-sm">
          Sign up to get started!
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      autoComplete="off"
                      {...field}
                      onChange={e => {
                        field.onChange(e)
                        debouncedUsername(e.target.value)
                      }}
                      className="bg-gray-50"
                    />
                  </FormControl>
                  {username && (
                    <p className={`text-xs mt-1 ${usernameMessage === "username is unique" ? "text-green-600" : "text-red-600"}`}>
                      {isLoading ? "Checking..." : usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      type="email"
                      autoComplete="off"
                      {...field}
                      className="bg-gray-50"
                    />
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
                    <Input
                      placeholder="Enter password"
                      type="password"
                      autoComplete="off"
                      {...field}
                      className="bg-gray-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmiting} className="w-full bg-purple-800 text-white rounded-md">
              {isSubmiting ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary underline hover:text-primary/80">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page