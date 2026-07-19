import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

export default function Chatbot() {
  const [messages, setMessages] = useState<{role: 'ai'|'user', content: string}[]>([
    { role: 'ai', content: "Good morning! ☀️ I'm your NutriSmart AI Assistant. How can I help you optimize your health today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "What should I eat for lunch?",
    "Suggest a high-protein snack",
    "How's my daily progress?",
    "Explain my macros"
  ]);
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (mainRef.current) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;
    
    setInput('');
    const newMessages: {role: 'ai'|'user', content: string}[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { messages: newMessages });
      const { reply, suggestions: newSuggestions } = res.data.data;
      
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
      if (newSuggestions && Array.isArray(newSuggestions) && newSuggestions.length > 0) {
        setSuggestions(newSuggestions);
      }
    } catch (err: unknown) {
       console.error(err);
       const status = (err as { response?: { status?: number } })?.response?.status;
       const msg = status === 429
         ? "I've hit my request limit for now. Please wait a minute and try again."
         : "Sorry, I'm having trouble connecting right now.";
       setMessages(prev => [...prev, { role: 'ai', content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-80px)] lg:h-[100dvh] max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-6 relative">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border-subtle shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl">psychiatry</span>
        </div>
        <div>
          <h1 className="font-headline-sm text-xl font-medium text-text-primary">AI Dietician</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="font-label-sm text-text-secondary">Always Online</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto px-2 lg:px-4 scroll-smooth flex flex-col gap-4 pb-4" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex max-w-[85%] ${msg.role === 'user' ? 'self-end justify-end' : 'self-start justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary shrink-0 mr-2 mt-auto">
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              </div>
            )}
            
            <div className={`p-3 rounded-2xl font-body-md text-base leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-surface border border-border-subtle text-text-primary rounded-br-sm'
                : 'bg-primary-container/10 text-text-primary rounded-bl-sm border border-primary/10'
            }`}>
              {msg.content}
            </div>
            
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-text-secondary shrink-0 ml-2 mt-auto">
                <span className="material-symbols-outlined text-[16px]">person</span>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex max-w-[85%] self-start animate-in fade-in duration-300">
             <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary shrink-0 mr-2 mt-auto">
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              </div>
            <div className="bg-primary-container/10 border border-primary/10 p-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 h-10">
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </main>

      {/* Interactive Footer */}
      <div className="shrink-0 pt-2 lg:pt-3 mt-auto">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-3 px-1" style={{ scrollbarWidth: 'none' }}>
          {suggestions.map((reply, idx) => (
            <button 
              key={idx}
              onClick={() => sendMessage(reply)}
              disabled={loading}
              className="whitespace-nowrap px-3 py-1.5 bg-white border border-border-subtle rounded-full font-label-md text-xs text-text-secondary hover:text-primary hover:border-primary/50 transition-colors active:scale-95 disabled:opacity-50 shadow-sm"
            >
              {reply}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2 bg-white p-1 pl-3 rounded-2xl border border-border-subtle shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all mb-2 lg:mb-0">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary font-body-md py-2 px-1 outline-none placeholder:text-text-secondary text-sm" 
            placeholder="Ask about your diet..." 
            type="text"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>
      </div>

    </div>
  );
}
