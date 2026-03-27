import {prisma} from "../../utils/prisma.js"

export async function findByEmail(email) {
    return await prisma.user.findUnique({
        where: {email}
    })
}

export async function createUser({email, hashed}) {
    return await prisma.user.create({
        data: {
            email: email,
            password: hashed
        }
    })
}

export async function updatePasswordById({id, hashed}) {
    return await prisma.user.update({
        where: {
            id: id
        },
        data: {
            password: hashed
        }
    })
}