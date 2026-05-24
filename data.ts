import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, RefreshCw, HelpCircle, Key, Cpu } from "lucide-react";
import { askAlnitakAI } from "../data";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "💫 Greetings! I am **Alnitak AI** (Alpha-Orionis 3), your personal career and skill expansion co-pilot.\n\nEnter any skill you wish to master (e.g., 'React', 'Python Data Science', 'Product UI/UX design') or ask about vacancy rates. I will analyze certification pathing, study hours, and suggest real-time free courses with credentials. Let's start training!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState("");

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // 👇👇 INGA UNGA ACTUAL API KEY-AH PODUNGA 👇👇
    const myApiKey = "Ysk-or-v1-9c0415128ff6ed2681094aca94f67287d76cad90bfdbdbe86e801d6d0db1f164"; 
    
    // API key automatic-ah save aagi state-kum poidum
    localStorage.setItem("openrouter_api_key", myApiKey);
    setOpenRouterKey(myApiKey);
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const aiReply = await askAlnitakAI({
        prompt: userMsg.content,
        contextHistory: history
      });

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        content: aiReply
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        content: "⚠️ Connection timeout. Alnitak AI simulated diagnostic mode is active. Please double check your local connection parameters."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const predefinedQueries = [
    "I want to learn Figma Product Design",
    "Best skill paths with 90%+ job availability?",
    "Learn FullStack Web development under 8 weeks",
    "Where can I get Free Certificates?"
  ];

  return (
    <div className="flex flex-col h-[550px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden relative shadow-sm">
      {/* Tab Header */}
      <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 tracking-tight">
              Alnitak Career AI-Coach
            </h3>
            <span className="text-[10px] sm:text-xs font-mono text-emerald-500 flex items-center gap-1 font-bold">
              ● ALNITAK v3.1 ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Profile Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-600" : "bg-emerald-500 text-white"}`}>
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-3.5 rounded-2xl text-[12.5px] leading-relaxed relative ${isUser ? "bg-neutral-900 text-white dark:bg-neutral-800" : "bg-neutral-55 dark:bg-neutral-800/40 text-neutral-900 dark:text-neutral-100 border border-neutral-100 dark:border-neutral-800"}`}>
                <div className="whitespace-pre-line font-light markdown-rendering">
                  {message.content.split("\n").map((line, i) => {
                    if (line.trim().startsWith("- **") || line.trim().startsWith("- ")) {
                      return <div key={i} className="pl-4 py-0.5 relative before:content-['•'] before:absolute before:left-1 before:text-emerald-500">{line.replace(/^- \*\*/g, "").replace(/^- /g, "")}</div>;
                    }
                    if (line.trim().startsWith("### ")) {
                      return <h4 key={i} className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100 mt-2 mb-1 flex items-center gap-1 text-emerald-500">⚜️ {line.replace("### ", "")}</h4>;
                    }
                    return <p key={i} className="py-0.5">{line}</p>;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 spin-slow" />
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/20 text-xs text-neutral-400 dark:text-neutral-500 border border-neutral-150 dark:border-neutral-805 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span>Alnitak AI is formulating study path...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested prompts chips */}
      {messages.length === 1 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5 overflow-x-auto select-none">
          {predefinedQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 hover:text-emerald-500 text-neutral-600 dark:text-neutral-400 transition"
            >
              💡 {q}
            </button>
          ))}
        </div>
      )}

      {/* Message input footer form */}
      <form onSubmit={handleSend} className="p-3.5 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Alnitak AI (e.g., 'React', 'Python Data Science')..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl transition duration-150 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
