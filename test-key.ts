import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import * as dotenv from "dotenv"

dotenv.config({ path: '.env.local' })

const apiKey = process.env.GROQ_API_KEY
const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: apiKey!,
})

async function test() {
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "openai/gpt-oss-120b", "openai/gpt-oss-20b"]

  for (const m of models) {
    try {
      console.log(`Trying model: ${m}...`)
      const { text } = await generateText({
        model: groq(m),
        prompt: "Say hello",
      })
      console.log(`✅ SUCCESS with ${m}:`, text)
      return
    } catch (e: any) {
      console.log(`❌ Failed with ${m}:`, e?.data?.error?.message || e.message)
    }
  }
}

test()
