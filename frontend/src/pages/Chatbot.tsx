import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Send, Bot } from 'lucide-react';
import { api } from '../services/api';

export default function Chatbot() {
  const [messages, setMessages] = useState<{role: 'ai'|'user', content: string}[]>([
    { role: 'ai', content: "Hi there! I'm your NutriSmart assistant. How can I help you meet your health goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
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

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-slate-500 mt-1">Ask questions about nutrition, ask for meal ideas, or get personalized advice.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-slate-200">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}>
                {msg.role === 'ai' && <Bot className="h-4 w-4 mb-2 opacity-50" />}
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center space-x-2">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
               </div>
             </div>
          )}
        </CardContent>
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message your nutritionist..."
              className="flex-1 rounded-full px-4"
            />
            <Button type="submit" disabled={!input.trim() || loading} className="rounded-full w-10 h-10 p-0 shrink-0 shadow-sm">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
