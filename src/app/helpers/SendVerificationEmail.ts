import { ApiResponse } from "../types/ApiResponse";
import { resend } from "../lib/Resend";

export async function sendVerificationEmail(username:string,email:string,otp:string):
Promise<ApiResponse> {
    try {
    await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'mwstessage}verification email',
    react: `welcome ${username} your otp is ${otp}`,
  });
        return {success:true,message:"send verification email successfully"}
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {success:false,message:"error in sending verification email"}
        
    }
}