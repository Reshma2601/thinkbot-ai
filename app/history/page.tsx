"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HistoryPage() {
  const [chats, setChats] = useState<any[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await supabase
        .from("chats")
        .select("*")
        .order("created_at", { ascending: false })
      if (data) setChats(data)
    }
    fetchChats()
  }, [])

  const handleDelete = async (id: number) => {
    await supabase.from("chats").delete().eq("id", id)
    setChats(prev => prev.filter(c => c.id !== id))
    toast.success("Deleted!")
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white">
      <nav className="bg-[#1a0f2e] border-b border-purple-900/50 px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🤖 ThinkBot AI
        </a>
        <div className="flex gap-4">
          <a href="/chat" className="text-gray-400 hover:text-white text-sm transition">
            Chat
          </a>
          <a href="/history" className="text-purple-400 text-sm font-semibold">
            History
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Chat History
        </h1>
        <p className="text-gray-400 mb-8">All your previous conversations</p>

        {chats.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">No chats yet</p>
            <a href="/chat" className="text-purple-400 hover:underline mt-2 block">
              Start your first chat →
            </a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {chats.map((chat: any) => (
            <div
              key={chat.id}
              className="bg-white/5 border border-purple-900/50 rounded-xl p-5"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full">
                  {chat.persona?.split("You are ThinkBot AI,")[1]?.split(".")[0]?.trim() || "General"}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs">
                    {new Date(chat.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    className="text-red-400 hover:text-red-300 text-xs transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-gray-400 text-xs mb-1">You asked:</p>
                <p className="text-white text-sm bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3">
                  {chat.message}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">ThinkBot replied:</p>
                <p className={`text-gray-300 text-sm whitespace-pre-wrap ${
                  expanded === chat.id ? "" : "line-clamp-3"
                }`}>
                  {chat.reply}
                </p>
              </div>

              <button
                onClick={() => setExpanded(expanded === chat.id ? null : chat.id)}
                className="text-purple-400 text-xs hover:underline mt-2"
              >
                {expanded === chat.id ? "Show Less ↑" : "View Full Reply ↓"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}