import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useChat } from "../api/chat"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  "What can you help me with?",
  "Check the status of my order",
  "Help me with a support issue",
  "Search the knowledge base"
]

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I am OpsPilot, your enterprise AI assistant. I can help you look up policies, check order status, or take actions like cancelling an order.',
    }
  ])
  const [input, setInput] = useState("")
  const [conversationId, setConversationId] = useState<string | undefined>(undefined)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const location = useLocation()
  const chatMutation = useChat()
  const isInitialMount = useRef(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, chatMutation.isPending])

  useEffect(() => {
    if (isInitialMount.current && location.state?.initialPrompt) {
      isInitialMount.current = false
      const prompt = location.state.initialPrompt
      handleSend(prompt)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleSend = async (text: string) => {
    if (!text.trim() || chatMutation.isPending) return

    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: text }])

    try {
      const data = await chatMutation.mutateAsync({ conversationId, message: text })
      if (data.conversationId) {
         setConversationId(data.conversationId)
      }
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'An error occurred while communicating with the AI backend. Please try again later.' }])
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full max-w-4xl mx-auto rounded-2xl border border-surface-container/50 shadow-xl bg-surface-container-lowest/80 backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="border-b border-surface-container/50 bg-surface-container-lowest/80 backdrop-blur-sm px-6 py-5 flex-shrink-0 relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-tertiary to-secondary"></div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-on-surface text-xl font-bold">
            <div className="w-10 h-10 rounded-xl bg-primary shadow-md shadow-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-on-primary" />
            </div>
            OpsPilot Intelligence
          </div>
          <span className="text-sm text-on-surface-variant ml-13">Your intelligent assistant for support and operations.</span>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-transparent custom-scrollbar relative z-0">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {SUGGESTED_PROMPTS.map(p => (
              <button 
                key={p} 
                onClick={() => handleSend(p)}
                className="text-sm font-medium px-4 py-2 rounded-full border border-surface-container/50 bg-surface-container/80 backdrop-blur-sm shadow-sm text-on-surface hover:text-primary hover:border-primary/50 hover:bg-surface-container-high transition-all hover:-translate-y-0.5"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={cn("flex w-full animate-in slide-in-from-bottom-2 fade-in duration-300", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}>
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {msg.role === 'user' ? (
                  <div className="w-10 h-10 rounded-full bg-surface-container/80 backdrop-blur-sm shadow-sm border border-surface-container-highest/50 flex items-center justify-center">
                    <User className="w-5 h-5 text-outline" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                    <Bot className="w-5 h-5 text-on-primary" />
                  </div>
                )}
              </div>
              
              {/* Message Content */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className={cn(
                  "p-5 text-base leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-on-primary rounded-3xl rounded-tr-sm" 
                    : "bg-surface-container/80 backdrop-blur-md border border-surface-container-highest/50 text-on-surface rounded-3xl rounded-tl-sm"
                )}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex w-full justify-start animate-in fade-in duration-300">
            <div className="flex gap-4 max-w-[85%]">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                  <Bot className="w-5 h-5 text-on-primary" />
                </div>
              </div>
              <div className="p-5 bg-surface-container/80 backdrop-blur-md border border-surface-container-highest/50 rounded-3xl rounded-tl-sm shadow-sm flex items-center h-14">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Footer / Input */}
      <div className="p-4 border-t border-surface-container/50 bg-surface-container-low/80 backdrop-blur-md z-10">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex w-full gap-3 relative">
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Ask OpsPilot..." 
            className="flex-1 bg-surface-container-lowest/80 backdrop-blur-sm border-surface-container/50 pr-14 h-14 rounded-2xl text-base shadow-sm focus-visible:ring-primary/30 text-on-surface placeholder:text-outline"
            disabled={chatMutation.isPending}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={chatMutation.isPending || !input.trim()}
            className="absolute right-1.5 top-1.5 h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 hover:scale-105 shadow-md shadow-primary/20 border-0 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5 text-on-primary" />
          </Button>
        </form>
      </div>
    </div>
  )
}
