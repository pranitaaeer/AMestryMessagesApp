import { sendVerificationEmail } from "@/app/helpers/SendVerificationEmail";
import dbConnect from "@/app/lib/DbConnect";
import UserModel from "@/app/models/User.model";
import bcrypt from "bcryptjs"

export async function POST(request:Request) {
    await dbConnect()
    try {
    const {username,email,password}=await request.json()
    const userwithUsername=await UserModel.findOne({username,isVerified:true})
    if(userwithUsername){
         return Response.json({
                success:false,
                message:"user is already exist with this username"
            },{status:400})
    }
    const userwithEmail=await UserModel.findOne({email})
    const verifyCode=Math.floor(100000+Math.random()*900000).toString()
    if(userwithEmail){
        if(userwithEmail.isVerified){
            return Response.json({
                    success:false,
                    message:"user is already exist with this email"
                },{status:400})
        }else{
           const hashedPssword=await bcrypt.hash(password,10)
           const expiryDate=new Date()
           expiryDate.setHours(expiryDate.getHours()+1)
           userwithEmail.password=hashedPssword
           userwithEmail.verifyCode=verifyCode
           userwithEmail.verifyCodeExpiry=expiryDate
           await userwithEmail.save()
        }
    }
    else{
      const hashedPssword=await bcrypt.hash(password,10)
           const expiryDate=new Date()
           expiryDate.setHours(expiryDate.getHours()+1)

           const user=new UserModel({
            username,
            email,
            password: hashedPssword,
            verifyCode: verifyCode,
            verifyCodeExpires: expiryDate,
            isVerified: false,
            isAcceptingMessages: true,
            messages:[]
           })
           await user.save()
    }
    //send verification email
    const response=await sendVerificationEmail(username,email,verifyCode)
    if(!response.success){
      return Response.json({success:false,message:"error in email verification of user"},{status:500})
    }
    return Response.json({success:true,message:"user signup successfully"},{status:500})
    } catch (error) {
        console.error("error in signup user",error)
        return Response.json({success:false,message:"error in signup user"},{status:500})
    }
}