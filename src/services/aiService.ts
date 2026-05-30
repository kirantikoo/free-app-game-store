import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai"
import app from "../firebase/config"

const ai = getAI(app, { backend: new GoogleAIBackend() })

const model = getGenerativeModel(ai, {
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    maxOutputTokens: 256,
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
  },
})

export async function generateAppSummary(
  name: string,
  category: string,
  tags: string[],
  description: string
): Promise<string> {
  const prompt = [
    "Write a concise, one-sentence summary for a software listing in an app store.",
    `App name: ${name}`,
    `Category: ${category}`,
    `Tags: ${tags.join(", ")}`,
    `Description: ${description}`,
    "Reply with only the summary sentence, no preamble.",
  ].join("\n")

  const result = await model.generateContent(prompt)
  return result.response.text()
}
