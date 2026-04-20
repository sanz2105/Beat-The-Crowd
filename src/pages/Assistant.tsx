import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, MessageSquare } from 'lucide-react';
import { useVenueData } from '../hooks/useVenueData';
import { askGemini } from '../services/gemini';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Assistant: React.FC = () => {
  const { zones } = useVenueData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !zones) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askGemini(input, zones);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "🍔 Shortest food wait?",
    "🚻 Nearest restroom?",
    "🚪 Best entry gate?",
    "🚶 Least crowded path to B12"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[80vh] bg-card-dark rounded-3xl border border-white/5 overflow-hidden shadow-2xl animate-count-up">
      {/* HEADER */}
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold">BeatTheCrowd AI</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
              <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Live Concierge</span>
            </div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-warning opacity-50" />
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center relative">
               <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-10"></div>
               <Bot className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Ask me anything</h3>
              <p className="text-text-secondary text-sm mt-2 max-w-xs">I have access to real-time stadium data to help you beat the crowd.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm">
              {suggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => setInput(s.replace(/[^a-zA-Z0-9 ]/g, "").trim())}
                  className="p-3 bg-white/5 border border-white/5 rounded-xl text-left text-xs font-bold hover:bg-white/10 hover:border-primary/30 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20' 
                : 'bg-white/5 border border-white/10 text-text-primary rounded-bl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[9px] mt-2 opacity-50 font-mono ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
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
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-white/5 border-t border-white/5">
        <div className="relative group">
          <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input 
            type="text" 
            placeholder="Ask about crowds, food, or navigation..."
            className="w-full bg-bg-dark border border-white/10 rounded-2xl py-4 pl-12 pr-16 focus:outline-none focus:border-primary transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
