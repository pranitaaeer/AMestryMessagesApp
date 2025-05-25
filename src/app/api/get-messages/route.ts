import {getServerSession} from "next-auth"
import {User} from "next-auth"
import dbConnect from "@/app/lib/DbConnect"
import UserModel from "@/app/models/User.model"
import { authOptions } from "../auth/[...nextauth]/options"
import mongoose from "mongoose"


export async function GET() {
    await dbConnect()
    try {
        const session= await getServerSession(authOptions)
        const user:User=session?.user as User

        if(!session || !session.user){
        return Response.json({success:false,message:"unAutheticated user"},{status:403})
        }
        const userId= new mongoose.Types.ObjectId(user._id)
        const getuserMessages=await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'messages'}}}
        ])
        if(!getuserMessages || getuserMessages.length<0){
        return Response.json({success:false,message:"no messages found"},{status:404})
        }

        return Response.json({success:true,messages:getuserMessages[0].messages},{status:200})
        
    } catch (error) {
        console.error("error in getting toggle message",error)
        return Response.json({success:false,message:"error in getting toggle message"},{status:500})
    }
}