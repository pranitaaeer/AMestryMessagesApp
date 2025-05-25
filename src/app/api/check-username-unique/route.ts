import dbConnect from "@/app/lib/DbConnect";
import UserModel from "@/app/models/User.model";
import {z} from "zod"
import { UsernameSchema } from "@/app/Schemas/SignupSchema";

const usernameQuerySchema=z.object({
    username:UsernameSchema
})
export async function GET(request:Request) {
    await dbConnect()
    try {
        const {searchParams}=new URL(request.url)
        const queryParams={
            username:searchParams.get('username')
        }
        const result=usernameQuerySchema.safeParse(queryParams)
        if(result.error){
            const usernameError=result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameError.length>0? usernameError.join(', '):"invalid username"
            },{status:400})
        }
        const {username}=result.data
        const existedUser=await UserModel.findOne({username})
        if(existedUser){
             return Response.json({
                success:false,
                message:"username is already taken"
            },{status:400})
        }
        return Response.json({
                success:true,
                message:"username is unique"
            },{status:200})

    } catch (error) {
        console.error("error in checking username",error)
        return Response.json({
                success:true,
                message:"error in checking username"
            },{status:400})
    }
}