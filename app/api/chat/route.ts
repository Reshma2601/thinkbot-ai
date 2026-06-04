import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key missing" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const { message, persona, history } = await req.json()

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: persona
    })

    const chatHistory = history
      .filter((msg: any) => msg.role !== "ai" || msg.content !== "Hi! I'm ThinkBot AI 🤖 How can I help you today?")
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))

    const chat = model.startChat({
      history: chatHistory
    })

    const result = await chat.sendMessage(message)
    const reply = result.response.text()
    const { createClient } = await import("@supabase/supabase-js")
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

await supabase.from("chats").insert({
  message: message,
  reply: reply,
  persona: persona
})

    return NextResponse.json({ reply })

  } catch (error: any) {
    console.error("Chat error:", error?.message)
    return NextResponse.json(
      { error: error?.message },
      { status: 500 }
    )
  }
}