import {z} from "zod"

export const CreateUserSchema = z.object({
    username : z.string().min(5).max(12),
    password : z.string(),
    email : z.string()
})
export const SigninSchema = z.object({
    username : z.string().min(5).max(12),
    password : z.string(),

})

export const CreateRoomSchema = z.object({
name : z.string().min(5).max(12)
})