"use client"
import { messageSchema } from '@/app/Schemas/messageSchema'
import { ApiResponse } from '@/app/types/ApiResponse'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'

const Page = () => {
    const Params=useParams<{username:string}>()
     const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
          content: "",
        },
      })
     const [isSubmiting, setIsSubmiting] = useState(false)
      const { toast } = useToast()
    //   const router = useRouter()
      async function onSubmit(data: z.infer<typeof messageSchema>) {
          setIsSubmiting(true)
          try {
            const response = await axios.post(`/api/send-message`, {
              username: Params.username,
              content: data.content
            })
            console.log("username:",Params.username)
            toast({
              title: "Send Message",
              description: response.data.message
            })
            
          } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
              title: "Message Error",
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
        <h2 className="text-3xl font-bold text-center mb-2 text-primary">Send Message</h2>
        <p className="text-center text-muted-foreground mb-6 text-sm">
           Send the anynoums messages
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Your Message</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter message" autoComplete="off" {...field} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmiting} className="w-full bg-purple-800 text-white rounded-md">
              {isSubmiting ? "Sending..." : "Send"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page