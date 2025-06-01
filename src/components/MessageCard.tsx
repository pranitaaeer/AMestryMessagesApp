'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import React from 'react'
import dayjs from "dayjs"
import { Message } from "@/app/models/User.model"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/app/types/ApiResponse"
import { Button } from "./ui/button"

type MessageProps = {
  message: Message;
  onMessageDelete: (messageid: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageProps) => {
  const { toast } = useToast()
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/delete-message/${message._id}`)
      toast({
        description: response.data.message
      })
      onMessageDelete(message._id as string)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "error",
        description: axiosError.response?.data.message || "error in deleting message",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="relative shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white pr-10">
          {message.content}
        </CardTitle>
        {/* X Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              aria-label="Delete"
            >
              <X className="w-5 h-5 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            className="
              bg-white text-black dark:bg-zinc-900 dark:text-white
              border border-gray-200 dark:border-zinc-700
              rounded-xl shadow-2xl
            "
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                This action cannot be undone. This will permanently delete your message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="
                  rounded-md px-4 py-2 font-semibold
                  bg-black text-white hover:bg-gray-800
                  dark:bg-purple-700 dark:text-white dark:hover:bg-purple-800
                  transition-colors
                "
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="
                  rounded-md px-4 py-2 font-semibold
                  bg-red-600 text-white hover:bg-red-700
                  transition-colors
                "
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {/* You can put more info here if needed */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add more content if needed */}
      </CardContent>
    </Card>
  )
}

export default MessageCard