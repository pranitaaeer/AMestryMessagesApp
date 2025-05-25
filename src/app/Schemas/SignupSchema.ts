import {z} from 'zod'

export const UsernameSchema=z 
 .string()
 .min(2,"username must be atleast 2 characters")
 .max(20,"username no longer than 20 characters")
 .regex(/^[a-zA-Z0-9_]+$/,"username must be valid")

export const SignupSchema=z.object({
    username:UsernameSchema,
    email:z.string().email(),
    password:z
    .string()
    .min(6,{message:"password must be atleast 6 characters"})
})