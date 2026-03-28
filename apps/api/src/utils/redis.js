import {createClient} from "redis"

export const redis = createClient({
    url: process.env.REDIS_URL,
})

redis.on("error", (err) => {
    console.error("Redis error:", err)
})

let isConnected = false

export async function connectRedis() {
    if (!isConnected) {
        await redis.connect()
        isConnected = true
    }
}