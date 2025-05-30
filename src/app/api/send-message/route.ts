import dbConnect from "@/app/lib/DbConnect";
import UserModel, { Message } from "@/app/models/User.model";


export async function POST(request:Request) {
    await dbConnect()
    try {
        const {username,content}=await request.json()
        const decodedUsername=decodeURIComponent(username)
        const user=await UserModel.findOne({username:decodedUsername})
        if(!user){
        return Response.json({success:false,message:"user not found"},{status:404})
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({success:true,message:"send message successfully"},{status:200})
    } catch (error) {
        console.error("error in sending message",error)
        return Response.json({success:false,message:"error in sending message"},{status:500})
    }
}