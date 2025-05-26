/* eslint-disable @typescript-eslint/no-explicit-any */

import {NextAuthOptions} from "next-auth"
import dbConnect from "@/app/lib/DbConnect";
import UserModel from "@/app/models/User.model";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"

export const authOptions:NextAuthOptions={
  providers: [
  CredentialsProvider({
    id:"credentials",
    name: "Credentials",
    credentials: {
      email: { label: "email", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any):Promise<any> {
     try {
        await dbConnect()
        const user=await UserModel.findOne({ $or: [{ email: credentials.identifiers }, { username: credentials.identifiers }] })
        if(!user){
           throw new Error("user not found")
        }
        if(!user.isVerified){
          throw new Error("please verify your account")
        }
        const isCorrectPassword=await bcrypt.compare(credentials.password,user.password)
        if(!isCorrectPassword){
          throw new Error("invalid password")
        }
        return user
     } catch (err:any) {
        throw new Error(err)
     }
    
    }
  })
],
callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.username=user.username
        token.isVerified=user.isVerified
        token.isAcceptingMessages=user.isAcceptingMessages

      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id=token._id?.toString()
        session.user.username=token.username
        session.user.isVerified=token.isVerified
        session.user.isAcceptingMessages=token.isAcceptingMessages
      }
      return session
    }
  },
pages: {
    signIn: '/signin',  // Displays signin buttons
},
session: {
    strategy: "jwt"
},
secret:process.env.NEXTAUTH_SECRET,
}