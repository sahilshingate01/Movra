'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface ChatPanelProps {
  userRole: string;
}

export default function ChatPanel({ userRole }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I am Movra, your AI assistant. How can I help you today in your role as a ${userRole}?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message to UI
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Prepare history for API (exclude the new message and format as expected)
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          role: userRole,
          history,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      // Add AI response to UI
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: error instanceof Error ? error.message : 'Sorry, I encountered an error.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{
      id: 'welcome',
      role: 'model',
      text: `Hello! I am Movra, your AI assistant. How can I help you today in your role as a ${userRole}?`,
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-canvas text-ink">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === 'user' 
                  ? 'bg-canvas-soft-2 text-ink border-hairline' 
                  : 'bg-primary text-on-primary border-primary'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              {/* Message Bubble */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-xl border shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-canvas-soft border-hairline text-ink rounded-tr-sm' 
                    : 'bg-canvas border-hairline text-ink rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-body-sm">{msg.text}</p>
                </div>
                <span className="text-caption-mono text-mute mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] flex-row gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary text-on-primary border border-primary">
                <Bot size={16} />
              </div>
              <div className="px-4 py-3 rounded-xl bg-canvas border border-hairline text-ink rounded-tl-sm shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-mute" />
                <span className="text-body-sm text-mute">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-canvas border-t border-hairline">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2">
          <button
            type="button"
            onClick={handleClear}
            title="Clear Chat"
            className="p-3 text-mute hover:text-error hover:bg-error-soft rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-error h-[52px]"
            aria-label="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
          
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask Movra anything..."
              className="w-full bg-canvas-soft-2 border border-hairline rounded-md py-3.5 pl-4 pr-12 text-ink placeholder:text-mute focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none max-h-32 min-h-[52px] text-body-sm"
              rows={1}
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 bg-primary hover:bg-ink/90 disabled:bg-hairline disabled:text-mute text-on-primary rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-canvas"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          <span className="text-caption text-mute">
            Movra AI can make mistakes. Please verify important information.
          </span>
        </div>
      </div>
    </div>
  );
}
