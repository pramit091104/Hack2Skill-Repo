import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

export default function Chatbot() {
  const [messages, setMessages] = useState<{role: 'ai'|'user', content: string}[]>([
    { role: 'ai', content: "Good morning! ☀️ Ready to start our healthy journey today? Have you had your breakfast yet?" }
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
    "Logged my breakfast",
    "Need snack ideas",
    "How's my protein?",
    "Check water intake"
  ];

  return (
    <div className="bg-background min-h-[calc(100vh-64px)] flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500">
      
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-10 flex items-center px-md py-sm max-w-container-chat mx-auto bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-sm">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary-container bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">psychiatry</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white"></span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-headline-md text-headline-md font-bold text-primary">AI Dietician</h1>
            <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              Active Now
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-base">
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main ref={mainRef} className="flex-1 w-full max-w-container-chat mx-auto pt-4 pb-48 px-md flex flex-col gap-chat-gap overflow-y-auto scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-base max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
            <div className={`p-md rounded-lg font-body-md text-body-md whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-tertiary text-on-tertiary rounded-br-none shadow-[0_4px_20px_rgba(169,51,73,0.08)]'
                : 'bg-primary-container text-on-primary-container rounded-bl-none shadow-[0_4px_20px_rgba(45,212,191,0.08)]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-end gap-base max-w-[85%] self-start">
            <div className="bg-primary-container text-on-primary-container p-md rounded-lg rounded-bl-none flex gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </main>

      {/* Interactive Footer Section */}
      <div className="fixed bottom-0 w-full max-w-container-chat mx-auto z-40 px-md pb-md flex flex-col gap-sm bg-gradient-to-t from-background via-background to-transparent pt-8">
        
        {/* Quick Suggestions Chips */}
        <div className="flex gap-base overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {quickReplies.map((reply, idx) => (
            <button 
              key={idx}
              onClick={() => sendMessage(reply)}
              disabled={loading}
              className="whitespace-nowrap px-md py-xs bg-white border border-primary/20 rounded-full font-label-sm text-primary shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:bg-primary/5 transition-colors active:scale-95"
            >
              {reply}
            </button>
          ))}
        </div>
        
        {/* Input Bar Container */}
        <form onSubmit={handleFormSubmit} className="flex items-center gap-sm bg-white p-xs rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-surface-container-high relative">
          <button type="button" className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">add_box</span>
          </button>
          
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-body-md py-2 px-2 outline-none" 
            placeholder="Type a message..." 
            type="text"
            disabled={loading}
          />
          
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-on-primary active:scale-90 transition-transform shadow-lg disabled:opacity-50"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>

    </div>
  );
}
