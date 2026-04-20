import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot, User, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { useVenueData } from '../hooks/useVenueData';
import { askGemini } from '../services/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const Assistant: React.FC = () => {
  const { zones } = useVenueData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !zones) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await askGemini(text, zones);
    
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const suggestions = [
    "🚪 Best gate to enter?",
    "🍔 Fastest food near me?",
    "🚻 Nearest restroom?",
    "🪑 How to reach my seat?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] relative">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-4 md:mb-8 px-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="p-2 bg-primary/20 rounded-xl">🤖</span>
            BeatTheCrowd AI
          </h1>
          <div className="flex items-center gap-2 mt-1 pl-1">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-success">● Live Concierge</span>
          </div>
        </div>
      </header>

      {/* CHAT AREA */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-24 px-2"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60%] text-center space-y-8 animate-in fade-in zoom-in duration-700">
            {/* Pulsing Orb */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] border-4 border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <Sparkles className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Ask me anything about the stadium</h2>
              <p className="text-sm text-text-secondary">I have real-time access to all 12 zones and wait times.</p>
            </div>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="p-4 bg-card-dark border border-white/5 rounded-2xl text-left text-xs font-bold hover:bg-primary/10 hover:border-primary/30 transition-all active:scale-95 flex items-center justify-between group"
                >
                  {s}
                  <ChevronRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${
                  m.role === 'user' ? 'bg-primary' : 'bg-card-dark'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                    : 'bg-card-dark text-text-primary rounded-tl-none border border-white/5'
                }`}>
                  {m.content}
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-card-dark border border-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card-dark p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce-stagger [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce-stagger [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce-stagger"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <div className="bg-[#1E293B] border border-white/10 rounded-full p-1 flex items-center shadow-2xl focus-within:border-primary/50 transition-all">
          <button className="p-3 text-text-secondary hover:text-primary transition-colors">
            <Mic className="w-6 h-6" />
          </button>
          <input 
            type="text" 
            placeholder="Type a message..."
            className="flex-1 bg-transparent py-3 px-2 text-sm focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
          />
          <button 
            onClick={() => handleSend(input)}
            className="bg-primary p-3 rounded-full text-white shadow-lg hover:bg-primary/80 active:scale-90 transition-all disabled:opacity-50"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
