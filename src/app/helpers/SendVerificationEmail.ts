import { ApiResponse } from "../types/ApiResponse";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(username:string,email:string,otp:string):
Promise<ApiResponse> {
    try {
    const response= await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'mwstrymessage}verification email',
    react: `welcome ${username} your otp is ${otp}`,
  });
        return {success:true,message:"send verification email successfully"}
    } catch (error) {
        return {success:false,message:"error in sending verification email"}
        
    }
}