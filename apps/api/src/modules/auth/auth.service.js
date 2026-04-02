import bcrypt from "bcrypt"

import * as authRepo from "./auth.repo.js"

import {userDto} from "./auth.dto.js"

const rounds = Number(process.env.SALT_ROUNDS)

export async function signUp({email, password, confirm}) {


    const existing = await authRepo.findByEmail(email)
    if (existing) {
        const e = new Error("Email already exists")
        e.status = 409
        throw e
    }

    if (password !== confirm) {
        const e = new Error("Passwords mismatch")
        e.status = 409
        throw e
    }

    const hashed = await bcrypt.hash(password, rounds)
    const user = await authRepo.createUser({email, hashed})
    console.log(`New user ${email}`)
    
    return userDto(user)
}

export async function signIn({email, password}) {
    const user = await authRepo.findByEmail(email)

    if (!user) {
        const e = new Error("Incorrect email or password")
        e.status = 401
        throw e
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        const e = new Error("Invalid credentials")
        e.status = 401
        throw e
    }
    return userDto(user)
}

export async function resetPassword({email, oldPassword, newPassword, confirmPassword}) {
    const user = await authRepo.findByEmail(email)

    if (!user) return null

    const match = await bcrypt.compare(oldPassword, user.password)
    if (!match) return null

    if (newPassword !== confirmPassword) {
        const e = new Error("Passwords mismatch")
        e.status = 409
        throw e
    }

    const hashed = await bcrypt.hash(newPassword, rounds)
    const updatedUser = await authRepo.updatePasswordById({id: user.id, hashed})

    return userDto(updatedUser)
}
export async function getUserByEmail(email) {
    const user = await authRepo.findByEmail(email)

    return userDto(user)
}