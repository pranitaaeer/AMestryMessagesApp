
import {z} from "zod"

export const verifyCodeSchema=z.object({
    code:z
    .string()
    .length(6,{message:"verify code must be 6 digit"})
})