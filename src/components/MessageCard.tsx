"use client"

import {
  Card,
  CardContent,
  CardHeader,
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

import React from "react"
import dayjs from "dayjs"
import { Message } from "@/app/models/User.model"
import { Trash2, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import { Button } from "./ui/button"

type MessageProps = {
  message: Message
  onMessageDelete: (messageid: string) => void
}

const MessageCard = ({
  message,
  onMessageDelete,
}: MessageProps) => {
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/delete-message/${message._id}`
      )

      toast({
        description: response.data.message,
      })

      onMessageDelete(message._id as string)
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string
      }>

      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message ||
          "Error in deleting message",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="group relative h-full overflow-hidden border-white/10 bg-white/[0.05] text-white shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-white/[0.07] hover:shadow-purple-500/10">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl transition-all duration-500 group-hover:bg-purple-500/20" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between gap-4">

          {/* Message Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <MessageSquare className="h-5 w-5 text-purple-400" />
          </div>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="border-white/10 bg-slate-950 text-white shadow-2xl shadow-purple-500/10">

              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-semibold">
                  Delete this message?
                </AlertDialogTitle>

                <AlertDialogDescription className="leading-6 text-slate-400">
                  Are you absolutely sure? This action cannot be undone.
                  The message will be permanently deleted from your inbox.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="gap-2 sm:gap-2">
                <AlertDialogCancel className="border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10 hover:text-white">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>

            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="relative flex flex-col">

        {/* Message */}
        <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
          <p className="text-sm leading-7 text-slate-200">
            {message.content}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">

          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-600">
              Received
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {dayjs(message.createdAt).format(
                "MMM D, YYYY h:mm A"
              )}
            </p>
          </div>

          {/* Small Status */}
          <div className="flex items-center gap-2 rounded-full border border-purple-400/10 bg-purple-500/5 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />

            <span className="text-[11px] font-medium text-purple-300">
              Anonymous
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MessageCard
