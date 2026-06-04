"use client"
import { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"

const personas = [
  { id: "general", name: "🤖 General", prompt: "You are ThinkBot AI, a helpful and friendly assistant." },
  { id: "coder", name: "🧑‍💻 Coder", prompt: "You are ThinkBot AI, an expert coding assistant. Help with code, debugging, and technical questions only." },
  { id: "writer", name: "✍️ Writer", prompt: "You are ThinkBot AI, a creative writing assistant. Help with writing, grammar, storytelling and content." },
  { id: "teacher", name: "🎓 Teacher", prompt: "You are ThinkBot AI, a patient teacher. Explain everything simply like teaching a student." },
]

type Message = {
  role: "user" | "ai"
  content: string
  time: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! I'm ThinkBot AI 🤖 How can I help you today?",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [persona, setPersona] = useState(personas[0])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage: Message = {
      role: "user",
      content: input,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          persona: persona.prompt,
          history: messages
        }),
      })
      const data = await res.json()
      const aiMessage: Message = {
        role: "ai",
        content: data.reply,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      toast.error("Something went wrong!")
    }
    setLoading(false)
  }

  const handleClear = () => {
    setMessages([{
      role: "ai",
      content: "Hi! I'm ThinkBot AI 🤖 How can I help you today?",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    }])
    toast.success("Chat cleared!")
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white flex flex-col">

      {/* Navbar */}
      <nav className="bg-[#1a0f2e] border-b border-purple-900/50 px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🤖 ThinkBot AI
        </a>
        <div className="flex items-center gap-3">
          <select
            value={persona.id}
            onChange={(e) => {
              const selected = personas.find(p => p.id === e.target.value)
              if (selected) {
                setPersona(selected)
                toast.success(`Switched to ${selected.name}!`)
              }
            }}
            className="bg-purple-900/50 border border-purple-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
          >
            {personas.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <a
  href="/history"
  className="text-gray-400 hover:text-white text-sm transition"
>
  History
</a>
<button
  onClick={handleClear}
  className="text-gray-400 hover:text-white text-sm transition"
>
  Clear Chat
</button>
          
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm"
                : "bg-white/10 text-gray-200 rounded-bl-sm border border-white/10"
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs opacity-50">{msg.time}</p>
        <button
    onClick={() => {
      navigator.clipboard.writeText(msg.content)
      toast.success("Copied!")
    }}
    className="text-xs opacity-50 hover:opacity-100 transition"
  >
    Copy
  </button>
    </div>
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-[#1a0f2e] border-t border-purple-900/50 p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder={`Ask ${persona.name}...`}
            className="flex-1 bg-white/10 border border-purple-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl transition font-semibold"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  )
}