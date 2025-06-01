'use client'

import { Message } from '@/app/models/User.model'
import { isAcceptingMessagesSchema } from '@/app/Schemas/isAcceptingMessagesSchema'
import { ApiResponse } from '@/app/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { useSession } from 'next-auth/react'
import MessageCard from '@/components/MessageCard'
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Loader2, Copy } from "lucide-react"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof isAcceptingMessagesSchema>>({
    resolver: zodResolver(isAcceptingMessagesSchema),
    defaultValues: { isAcceptingMessages: true }
  })
  const { watch, setValue } = form
  const isAcceptingMessages = watch('isAcceptingMessages')

  // Fetch Accepting Messages Status
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitching(true)
    try {
      const response = await axios.get<ApiResponse>('/api/toggle-message')
      setValue('isAcceptingMessages', response.data?.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({ description: axiosError.message })
    } finally {
      setIsSwitching(false)
    }
  }, [setValue, toast])

  // Fetch Messages
  const fetchMessages = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({ description: axiosError.message })
    } finally {
      setIsLoading(false)
    }
  }, [toast, setMessages, setIsLoading])

  // Toggle Accepting Messages
  const toggleMessage = async () => {
    setIsSwitching(true)
    try {
      const response = await axios.post<ApiResponse>('/api/toggle-message', {
        isAcceptingMessages: !isAcceptingMessages
      })
      setValue('isAcceptingMessages', !isAcceptingMessages)
      toast({ description: response.data.message })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({ description: axiosError.message })
    } finally {
      setIsSwitching(false)
    }
  }

  // Delete Message Handler
  const handleDeleteMessages = (messageid: string) => {
    setMessages(messages.filter((message) => message._id !== messageid))
  }

  // Profile URL
  const username = session?.user?.username
  const baseurl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ""
  const profileUrl = username ? `${baseurl}/u/${username}` : ""

  const copyToClipBoard = () => {
    if (!profileUrl) return
    navigator.clipboard.writeText(profileUrl)
    toast({ description: "Profile URL copied to clipboard" })
  }

  useEffect(() => {
    if (!session || !session?.user) return
    fetchAcceptMessage()
    fetchMessages()
  }, [fetchAcceptMessage, fetchMessages, session, setValue, toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-2 py-4 md:px-6 md:py-8">
      <div className="w-full max-w-7xl mx-auto bg-white/90 rounded-xl shadow-xl p-2 md:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-1">Dashboard</h2>
            <p className="text-muted-foreground text-sm">Manage your messages and settings</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Accepting Messages</span>
            <Switch
              checked={isAcceptingMessages}
              onCheckedChange={toggleMessage}
              className="bg-gray-200 dark:bg-zinc-800 border border-purple-600 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-300"
              disabled={isSwitching}
            />
            {isSwitching && <Loader2 className="animate-spin h-4 w-4 ml-2 text-primary" />}
          </div>
        </div>
        <Separator className="mb-6" />
        <div className="flex items-center gap-2 mb-8 border-gray-700 ml-4 w-full">
          <span className="truncate text-sm bg-gray-700 text-white px-2 py-1 rounded">{profileUrl}</span>
          <Button size="icon" variant="outline" onClick={copyToClipBoard} disabled={!profileUrl}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No messages yet.
            </div>
          ) : (
            <div
              className="
                grid grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-6
              "
            >
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessages}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page