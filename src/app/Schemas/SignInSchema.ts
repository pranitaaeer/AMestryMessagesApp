import {z} from "zod"

export const SignInSchema=z.object({
    identifiers:z.string(),
    password:z.string()
})