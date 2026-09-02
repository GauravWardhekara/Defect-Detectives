import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AlertModal } from './AlertModal';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const Chatbot = () => {
  const { networkConfig, aiConfig } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your AI assistant. How can I help you with your defects today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!aiConfig?.apiKey) {
      setMessages(prev => [...prev, { role: 'user', text: input.trim() }, { role: 'model', text: 'Please configure your AI API key in the Workspace Settings first.' }]);
      setInput('');
      return;
    }

    const userMsg: Message = { role: 'user', text: input.trim() };
    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      const baseUrl = networkConfig?.masterUrl && !networkConfig.isMaster ? networkConfig.masterUrl : '';
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          history: currentHistory.filter(m => m.role === 'user' || m.role === 'model'),
          message: userMsg.text,
          systemInstruction: 'You are a helpful AI assistant for the Defect Diary application. You help users manage, analyze, and understand their software defects.',
          aiConfig
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to get chat response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || "";
      if (errMsg.includes("API Key") || errMsg.includes("Model") || errMsg.includes("Invalid") || errMsg.includes("Missing")) {
        setAlertMessage(`${errMsg}. Please update your settings in the AI Configuration.`);
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an authentication error. Please check your AI config.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <>
      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-16 w-[60px] h-[60px] bg-white border border-ink-faint rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center justify-center z-50 cursor-pointer text-ink hover:bg-bg-base transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
      </>
    );
  }

  return (
    <>
      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <div className="fixed bottom-28 right-16 w-96 h-[500px] bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-ink-faint flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-ink text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-ink rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-white/50">Defect Diary</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-base">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-ink text-white' : 'bg-white border border-ink-faint text-ink'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-ink text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] gap-2 flex-row">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white border border-ink-faint text-ink">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-xs text-slate-500">Typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="relative flex items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={"Ask me anything..."}
            disabled={isLoading}
            className="w-full bg-bg-base border border-ink-faint rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink focus:bg-white resize-none max-h-32 min-h-[44px]"
            rows={input.split('\\n').length > 1 ? Math.min(input.split('\\n').length, 4) : 1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 w-8 h-8 bg-ink text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:bg-ink-muted hover:opacity-90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-[10px] text-center text-ink-muted mt-2">
          AI can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
    </>
  );
};
