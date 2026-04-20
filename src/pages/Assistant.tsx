import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageSquare, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useVenueData } from '../hooks/useVenueData';
import { askGemini, type GeminiMessage } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'error';
  timestamp: Date;
}

const Assistant: React.FC = () => {
  const { zones } = useVenueData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Rate limiting ref: track last 3 request timestamps
  const requestTimestamps = useRef<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // WCAG: Focus the new bot message for screen readers
    if (messages.length > 0 && messages[messages.length - 1].sender !== 'user') {
      lastMessageRef.current?.focus();
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) return;

    // WCAG: Rate limiting logic (Max 3 requests per 60 seconds)
    const now = Date.now();
    const windowMs = 60000;
    requestTimestamps.current = requestTimestamps.current.filter(t => now - t < windowMs);
    
    if (requestTimestamps.current.length >= 3) {
      const waitTime = Math.ceil((windowMs - (now - requestTimestamps.current[0])) / 1000);
      setError(`Please wait ${waitTime} seconds before asking again.`);
      return;
    }

    setError(null);

    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    requestTimestamps.current.push(now);
    setInput('');
    setIsTyping(true);

    try {
      if (!zones) {
        throw new Error("Stadium data is still loading. Please wait a moment.");
      }

      // Convert message history to Gemini REST format
      const history: GeminiMessage[] = messages
        .filter(m => m.sender !== 'error')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const response = await askGemini(
        trimmedInput, 
        JSON.stringify(zones),
        history
      );
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Assistant Error:", err);
      const errorMessage = err.message || "AI temporarily unavailable. Try again.";
      setError(errorMessage);
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'error',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "🍔 Shortest food wait?",
    "🚻 Nearest restroom?",
    "🚪 Best entry gate?",
    "🚶 Least crowded path"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[80vh] bg-card-dark rounded-3xl border border-white/5 overflow-hidden shadow-2xl animate-count-up">
      {/* HEADER */}
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              ⚡ AI Assistant
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true"></div>
              <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Secure Concierge</span>
            </div>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-success opacity-50" aria-label="Security verified" />
      </div>

      {/* MESSAGES AREA */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center relative">
               <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-10"></div>
               <Bot className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Stadium Intelligence</h3>
              <p className="text-text-secondary text-sm mt-2 max-w-xs">Ask about crowds, wait times, or directions. I have live access to the stadium state.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm" role="group" aria-label="Quick suggestions">
              {suggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => setInput(s)}
                  className="p-3 bg-white/5 border border-white/5 rounded-xl text-left text-xs font-bold hover:bg-white/10 hover:border-primary/30 transition-all focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            ref={idx === messages.length - 1 ? lastMessageRef : null}
            tabIndex={-1}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl relative outline-none ${
              msg.sender === 'user' 
                ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20' 
                : msg.sender === 'error'
                ? 'bg-danger/10 border border-danger/20 text-danger rounded-bl-none'
                : 'bg-white/5 border border-white/10 text-text-primary rounded-bl-none'
            }`}>
              {msg.sender === 'error' && <AlertCircle className="w-4 h-4 mb-2" aria-hidden="true" />}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-[9px] mt-2 opacity-50 font-mono ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start" role="status" aria-label="AI is thinking">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="bg-card-dark p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center">
                <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-white/5 border-t border-white/5">
        <div className="relative group">
          <label htmlFor="chat-input" className="sr-only">Ask AI Assistant</label>
          <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" aria-hidden="true" />
          <input 
            id="chat-input"
            type="text" 
            maxLength={500}
            placeholder={isTyping ? "AI is thinking..." : "Ask about crowds or facilities..."}
            className="w-full bg-bg-dark border border-white/10 rounded-2xl py-4 pl-12 pr-20 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner disabled:opacity-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <div 
            className="absolute right-16 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-text-secondary"
            aria-live="polite"
          >
             {input.length}/500
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        {error && (
          <p className="text-[10px] text-danger font-bold mt-2 flex items-center gap-1" role="alert">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Assistant;
