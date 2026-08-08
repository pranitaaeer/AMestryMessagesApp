"use client"

import React, { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  LogIn,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const Navbar = () => {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center gap-3"
        >
          {/* Logo Icon */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/40">
            <Sparkles className="h-5 w-5 text-white" />

            {/* Glow */}
            <div className="absolute inset-0 -z-10 rounded-xl bg-purple-500/30 blur-md" />
          </div>

          {/* Logo Text */}
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Mestry
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Messages
              </span>
            </h1>

            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:block">
              Anonymous • Connect • Share
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              {/* Dashboard */}
              <Button
                asChild
                variant="ghost"
                className="rounded-full px-5 text-slate-300 transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-300"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              {/* Logout */}
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="rounded-full border-white/10 bg-white/[0.04] px-5 font-semibold text-slate-300 backdrop-blur-md transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </>
          ) : (
            /* Login */
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:from-purple-400 hover:to-blue-400 hover:shadow-purple-500/30"
            >
              <Link href="/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition-all hover:border-purple-400/30 hover:bg-purple-500/10 hover:text-purple-300 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileOpen
            ? "max-h-60 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl space-y-2 px-4 py-4 sm:px-6">
          {session ? (
            <>
              <Button
                asChild
                variant="ghost"
                onClick={() => setMobileOpen(false)}
                className="w-full justify-start rounded-xl text-slate-300 hover:bg-purple-500/10 hover:text-purple-300"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-3 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setMobileOpen(false)
                  signOut()
                }}
                className="w-full justify-start rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Log Out
              </Button>
            </>
          ) : (
            <Button
              asChild
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-white shadow-lg shadow-purple-500/20"
            >
              <Link href="/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

