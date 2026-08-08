import dbConnect from "@/app/lib/DbConnect";
import UserModel from "@/app/models/User.model";

export async function POST(request:Request) {
    await dbConnect()
    try {
        const {username,code}=await request.json()
        console.log("username",username)
        const decodedUsername=decodeURIComponent(username)
        console.log("decodedUsername",decodedUsername)
        const user=await UserModel.findOne({username:decodedUsername})
        console.log("user",user)
        if(!user){
            return Response.json({success:false,message:"user not found"},{status:404})
        }
        const isCodeCorrect=user!.verifyCode=== code
        const expiry=new Date(user!.verifyCodeExpiry) > new Date()

        if(!isCodeCorrect){
            return Response.json({success:false,message:"incorrect otp"},{status:401})
        }
        if(!expiry){
            console.log("otp expired")
            return Response.json({success:false,message:"your otp is expired ,please sign in again"},{status:404})
        }
        user.isVerified=true
        await user.save()
        return Response.json({success:true,message:"user verified sucessfully"},{status:200})

        
    } catch (error) {
        console.error("error in verification",error)
        return Response.json({success:false,message:"error in verification"},{status:500})
        
    }
}
