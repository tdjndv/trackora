import {z} from "zod"

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email"))


export const signUpBodySchema = z.object({
    email: emailSchema,
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(8, "Password must be at least 8 characters")
})

export const signInBodySchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required")
})

export const resetPasswordBodySchema = z.object({
    email: emailSchema,
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters")
})