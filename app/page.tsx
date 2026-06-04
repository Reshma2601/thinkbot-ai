export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0a1e] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        
        {/* Glowing circle behind robot */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-30 scale-150"></div>
          <div className="relative text-7xl">🤖</div>
        </div>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ThinkBot AI
        </h1>
        <p className="text-gray-400 text-lg mb-2">
          Your intelligent AI assistant
        </p>
        <p className="text-gray-600 text-sm mb-10">
          Powered by Gemini AI • Multiple Personas • Smart Conversations
        </p>

        <a
          href="/chat"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-10 py-4 rounded-full transition text-lg shadow-lg shadow-purple-900"
        >
          Start Chatting →
        </a>

        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🧑‍💻</div>
            <p className="text-sm text-gray-400">Coder Mode</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">✍️</div>
            <p className="text-sm text-gray-400">Writer Mode</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🎓</div>
            <p className="text-sm text-gray-400">Teacher Mode</p>
          </div>
        </div>

      </div>
    </main>
  )
}