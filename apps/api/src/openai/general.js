import { openai } from "../utils/openai.js"

export async function getResponse(input) {
    return await openai.responses.create({
        model: "gpt-5.4",
        input: input
    })
}