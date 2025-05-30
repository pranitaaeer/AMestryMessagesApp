"use client"
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Navbar= () => {
  const { data: session } = useSession()

  return (
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 shadow-md border-b border-gray-100 h-25">
        <a href="#" className="text-2xl font-bold text-primary tracking-tight">
          Mestry Messages
        </a>
        {session ? (
          <Button variant="outline" className="rounded-md border-purple-700 hover:bg-purple-950 text-white" onClick={() => signOut()}>
            Log Out
          </Button>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" className="rounded-md border-purple-700 hover:bg-purple-950 text-white">Login</Button>
          </Link>
        )}
      </nav>
      
  )
}

export default Navbar