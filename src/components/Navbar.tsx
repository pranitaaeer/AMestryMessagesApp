"use client"
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  const { data: session } = useSession()

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-900/80 shadow-md border-b border-gray-100 dark:border-zinc-800 h-20">
      <a href="#" className="text-2xl font-bold text-primary tracking-tight">
        Mestry Messages
      </a>
      <div className="flex gap-3">
        {session ? (
          <>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className={`
                  rounded-4xl px-6 py-2  mr-3 font-semibold border
                  border-black text-black hover:bg-black hover:text-white
                  dark:border-purple-700 dark:text-white dark:hover:bg-purple-950 dark:hover:text-white
                  transition-colors
                `}
              >
                Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className={`
                rounded-4xl px-5 py-2 font-semibold border
                border-black text-black hover:bg-black hover:text-white
                dark:border-purple-700 dark:text-white dark:hover:bg-purple-950 dark:hover:text-white
                transition-colors
              `}
              onClick={() => signOut()}
            >
              Log Out
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              variant="outline"
              className={`
                rounded-4xl px-5 py-2 font-semibold border
                border-black text-black hover:bg-black hover:text-white
                dark:border-purple-700 dark:text-white dark:hover:bg-purple-950 dark:hover:text-white
                transition-colors
              `}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar