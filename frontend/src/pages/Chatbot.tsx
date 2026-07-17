import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

export default function Chatbot() {
  const [messages, setMessages] = useState<{role: 'ai'|'user', content: string}[]>([
    { role: 'ai', content: "Good morning! ☀️ I'm your NutriSmart AI Assistant. How can I help you optimize your health today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
      const reply = res.data.data.reply;
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
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

  const quickReplies = [
    "What should I eat for lunch?",
    "Suggest a high-protein snack",
    "How's my daily progress?",
    "Explain my macros"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-[1200px] mx-auto px-margin-page py-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border-subtle shrink-0">
        <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">psychiatry</span>
        </div>
        <div>
          <h1 className="font-headline-sm text-2xl font-medium text-text-primary">AI Dietician</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="font-label-sm text-text-secondary">Always Online</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto px-4 scroll-smooth flex flex-col gap-6 pb-6" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex max-w-[80%] ${msg.role === 'user' ? 'self-end justify-end' : 'self-start justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            
            {msg.role === 'ai' && (
              <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary shrink-0 mr-3 mt-auto">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
            )}
            
            <div className={`p-4 rounded-2xl font-body-md text-lg leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-surface border border-border-subtle text-text-primary rounded-br-sm'
                : 'bg-primary-container/10 text-text-primary rounded-bl-sm border border-primary/10'
            }`}>
              {msg.content}
            </div>
            
            {msg.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-text-secondary shrink-0 ml-3 mt-auto">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex max-w-[80%] self-start animate-in fade-in duration-300">
             <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary shrink-0 mr-3 mt-auto">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
            <div className="bg-primary-container/10 border border-primary/10 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2 h-14">
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </main>

      {/* Interactive Footer */}
      <div className="shrink-0 pt-4 mt-auto">
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {quickReplies.map((reply, idx) => (
            <button 
              key={idx}
              onClick={() => sendMessage(reply)}
              disabled={loading}
              className="whitespace-nowrap px-4 py-2 bg-white border border-border-subtle rounded-full font-label-md text-text-secondary hover:text-primary hover:border-primary/50 transition-colors active:scale-95 disabled:opacity-50"
            >
              {reply}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleFormSubmit} className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-border-subtle shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary font-body-md py-3 px-4 outline-none placeholder:text-text-secondary" 
            placeholder="Ask about your diet..." 
            type="text"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-white hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>

    </div>
  );
}
