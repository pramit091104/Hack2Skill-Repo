import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const PLACEHOLDERS = [
  "Ask about your diet...",
  "How many calories in an apple?",
  "Suggest a high protein breakfast...",
  "Can I eat carbs at night?",
  "What should I eat after my workout?"
];

export default function Chatbot() {
  const [messages, setMessages] = useState<{role: 'ai'|'user', content: string}[]>(() => {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour >= 5 && hour < 12) greeting = 'Good morning';
    else if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
    
    return [
      { role: 'ai', content: `${greeting}! ☀️ I'm Niro. How can I help you optimize your health today?` }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "What should I eat for lunch?",
    "Suggest a high-protein snack",
    "How's my daily progress?",
    "Explain my macros"
  ]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentText = PLACEHOLDERS[placeholderIndex];
    let typingTimer: NodeJS.Timeout;

    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
      } else {
        typingTimer = setTimeout(() => {
          setDisplayText(currentText.substring(0, displayText.length - 1));
        }, 30); // deleting speed
      }
    } else {
      if (displayText === currentText) {
        typingTimer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); // pause duration before deleting
      } else {
        typingTimer = setTimeout(() => {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        }, 50); // typing speed
      }
    }

    return () => clearTimeout(typingTimer);
  }, [displayText, isDeleting, placeholderIndex]);

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
    <div className="flex flex-col min-h-[calc(100dvh-80px)] lg:min-h-screen max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-8 pt-4 lg:pt-6 relative pb-[160px]">
      
      {/* Premium Full-Screen Background Gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-primary/15 via-primary/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 pb-2 lg:mb-4 lg:pb-3 border-b border-border-subtle shrink-0 relative z-10">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-xl lg:text-2xl">psychiatry</span>
        </div>
        <div>
          <h1 className="font-headline-sm text-lg lg:text-xl font-medium text-text-primary">Niro</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-label-sm text-text-secondary text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto px-2 lg:px-4 scroll-smooth flex flex-col gap-4 pb-4 relative z-10" style={{ scrollbarWidth: 'thin' }}>
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
      <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-72 right-0 bg-white rounded-t-[2rem] border-t border-x lg:border-x-0 border-border-subtle/30 px-2 sm:px-4 lg:px-8 pt-4 pb-2 lg:pb-6 z-40 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1200px] mx-auto relative">
          <div className="flex gap-2 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: 'none' }}>
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
          
          <form onSubmit={handleFormSubmit} className="flex items-center gap-2 bg-white p-1 pl-3 rounded-2xl border border-border-subtle shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary font-body-md py-2 px-1 outline-none placeholder:text-text-secondary text-sm transition-all duration-500" 
              placeholder={displayText || " "} 
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
    </div>
  );
}
