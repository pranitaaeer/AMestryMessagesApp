
import {z} from "zod"

export const isAcceptingMessagesSchema=z.object({
    isAcceptingMessages:z.boolean()
})