// import dbConnect from "@/app/lib/DbConnect";
// import UserModel from "@/app/models/User.model";
// import { getServerSession ,User} from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";


// export async function DELETE(request:Request,{params}:{params:{messageid:string}}) {
//     await dbConnect()
//     try {
//         const messageid=params.messageid
//         if(!messageid){
//             return Response.json({success:false,message:"message id is required"},{status:400})
//         }
//         const session=await getServerSession(authOptions)
//         const user:User=session?.user as User
//         if(!user || !session?.user){
//         return Response.json({success:false,message:"user not found"},{status:404})
//         }
        
//         const updatedResult=await UserModel.updateOne({_id:user._id},
//             {$pull:{messages:{_id:messageid}}},{new:true}
//         )
//          if(!updatedResult.modifiedCount){
//             return Response.json({success:false,message:"message not found"},{status:404})
//         }
//         return Response.json({success:true,message:"delete message successfully"},{status:200})
//     } catch (error) {
//         console.error("error in sending message",error)
//         return Response.json({success:false,message:"error in sending message"},{status:500})
//     }
// }

import dbConnect from "@/app/lib/DbConnect";
import UserModel from "@/app/models/User.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
    await dbConnect()
    try {
        const { messageid } = await params;
        if(!messageid){
            return Response.json({success:false,message:"message id is required"},{status:400})
        }
        const session=await getServerSession(authOptions)
        const user:User=session?.user as User
        if(!user || !session?.user){
        return Response.json({success:false,message:"user not found"},{status:404})
        }
        
        const updatedResult=await UserModel.updateOne({_id:user._id},
            {$pull:{messages:{_id:messageid}}},{new:true}
        )
         if(!updatedResult.modifiedCount){
            return Response.json({success:false,message:"message not found"},{status:404})
        }
        return Response.json({success:true,message:"delete message successfully"},{status:200})
    } catch (error) {
        console.error("error in deleting message",error)
        return Response.json({success:false,message:"error in deleting message"},{status:500})
    }
}