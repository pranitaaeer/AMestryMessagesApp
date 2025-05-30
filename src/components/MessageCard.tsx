
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
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/app/types/ApiResponse"
import { Button } from "./ui/button"

 type MessageProps={
    message:Message;
    onMessageDelete:(messageid:string)=> void
}
const MessageCard= ({message,onMessageDelete}:MessageProps) => {
   
const {toast}=useToast()
const handleDelete=async()=>{
  try {
    const response=await axios.delete(`/api/delete-message/${message._id}`)
    toast({
        description:response.data.message
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
    <Card>
  <CardHeader>
    <CardTitle>{message.content}</CardTitle>
    <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" className="absolute right-2 top-2">
    <X />
    </Button>
    </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
 <div>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</div>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
  </CardContent>
  
</Card>

  )
}

export default MessageCard