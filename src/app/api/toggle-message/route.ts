import {getServerSession} from "next-auth"
import {User} from "next-auth"
import dbConnect from "@/app/lib/DbConnect"
import UserModel from "@/app/models/User.model"
import { authOptions } from "../auth/[...nextauth]/options"

export async function POST(request:Request) {
    await dbConnect()
    try {
        const session= await getServerSession(authOptions)
        const user:User=session?.user as User

        if(!session || !session.user){
        return Response.json({success:false,message:"unAutheticated user"},{status:403})
        }
        const UserId=user._id
        const {isAcceptingMessages}=await request.json()
        const existedUser=await UserModel.findById(UserId)
        if(!existedUser){
        return Response.json({success:false,message:"user not found"},{status:403})
        }
        existedUser.isAcceptingMessages=isAcceptingMessages
        await existedUser.save()

        return Response.json({success:true,message:"toggle accesspting message successfully"},{status:200})
        
    } catch (error) {
        console.error("error in toggle message",error)
        return Response.json({success:false,message:"error in toggle message"},{status:500})
    }
}
export async function GET() {
    await dbConnect()
    try {
        const session= await getServerSession(authOptions)
        const user:User=session?.user as User

        if(!session || !session.user){
        return Response.json({success:false,message:"unAutheticated user"},{status:403})
        }
        const UserId=user._id
        const existedUser=await UserModel.findById(UserId)
        if(!existedUser){
        return Response.json({success:false,message:"user not found"},{status:403})
        }

        return Response.json({success:true,isAcceptingMessages:existedUser.isAcceptingMessages},{status:200})
        
    } catch (error) {
        console.error("error in getting toggle message",error)
        return Response.json({success:false,message:"error in getting toggle message"},{status:500})
    }
}