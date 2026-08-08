"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle2, X, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-3 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))

ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  [
    "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl",
    "border p-4 pr-10 shadow-2xl backdrop-blur-xl",
    "transition-all duration-300",
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=move]:transition-none",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-80",
    "data-[state=closed]:slide-out-to-right-full",
    "data-[state=open]:slide-in-from-top-full",
    "data-[state=open]:sm:slide-in-from-bottom-full",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-purple-400/20",
          "bg-slate-950/90",
          "text-slate-100",
          "shadow-purple-500/10",
        ].join(" "),

        destructive: [
          "border-red-400/20",
          "bg-slate-950/95",
          "text-slate-100",
          "shadow-red-500/10",
        ].join(" "),
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {/* Ambient Glow */}
      <div
        className={cn(
          "pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full blur-2xl",
          variant === "destructive"
            ? "bg-red-500/10"
            : "bg-purple-500/15"
        )}
      />

      {/* Status Icon */}
      <div
        className={cn(
          "relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          variant === "destructive"
            ? "bg-red-500/10 text-red-400"
            : "bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400"
        )}
      >
        {variant === "destructive" ? (
          <AlertCircle className="h-5 w-5" />
        ) : (
          <CheckCircle2 className="h-5 w-5" />
        )}
      </div>

      {/* Toast Content */}
      <div className="relative min-w-0 flex-1 py-0.5">
        {props.children}
      </div>
    </ToastPrimitives.Root>
  )
})

Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg",
      "border border-white/10 bg-white/[0.05] px-3",
      "text-sm font-medium text-slate-200",
      "transition-all duration-200",
      "hover:border-purple-400/30 hover:bg-purple-500/10 hover:text-purple-300",
      "focus:outline-none focus:ring-2 focus:ring-purple-500/30",
      "disabled:pointer-events-none disabled:opacity-50",
      "group-[.destructive]:border-red-400/20",
      "group-[.destructive]:hover:border-red-400/30",
      "group-[.destructive]:hover:bg-red-500/10",
      "group-[.destructive]:hover:text-red-300",
      "group-[.destructive]:focus:ring-red-500/30",
      className
    )}
    {...props}
  />
))

ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1.5",
      "text-slate-500 opacity-0",
      "transition-all duration-200",
      "hover:bg-white/[0.08] hover:text-slate-200",
      "focus:opacity-100 focus:outline-none",
      "focus:ring-2 focus:ring-purple-500/30",
      "group-hover:opacity-100",
      "group-[.destructive]:text-red-400/60",
      "group-[.destructive]:hover:bg-red-500/10",
      "group-[.destructive]:hover:text-red-300",
      "group-[.destructive]:focus:ring-red-500/30",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))

ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-sm font-semibold leading-5 text-white",
      "[&+div]:mt-1 [&+div]:text-xs [&+div]:leading-5",
      className
    )}
    {...props}
  />
))

ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-sm leading-5 text-slate-400",
      className
    )}
    {...props}
  />
))

ToastDescription.displayName =
  ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<
  typeof Toast
>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
