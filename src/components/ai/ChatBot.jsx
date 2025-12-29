'use client';
import { useState, useRef, useEffect } from 'react';
import useAxios from '@/hooks/useAxios';
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hi! I'm PantryPal AI 🧠. Ask me about savings or recipes!", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const dropdownRef = useRef(null); // To detect clicks outside
  const axios = useAxios();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, loading]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        const { data } = await axios.post('/ai/chat', { 
            message: userMsg.text,
            history: messages // <--- Send the previous conversation
        });
        setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
        setMessages(prev => [...prev, { text: "AI is offline.", sender: 'bot' }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      
      {/* 1. NAVBAR TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isOpen 
            ? 'bg-green-100 text-green-700 font-bold' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'
        }`}
      >
        <HiSparkles className={isOpen ? "text-green-600" : "text-yellow-500"} />
        <span className="hidden md:inline">Ask AI</span>
      </button>

      {/* 2. DROPDOWN CHAT WINDOW */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 md:w-96 h-[450px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-down origin-top-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 flex justify-between items-center text-white shadow-sm">
            <div className="flex items-center gap-2">
                <FaRobot className="text-white/90" />
                <h3 className="font-bold text-sm">PantryPal Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                <FaTimes size={14} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-2.5 rounded-2xl text-sm shadow-sm ${
                        msg.sender === 'user' 
                        ? 'bg-green-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    }`}>
                        {msg.text.split('\n').map((line, i) => (
                            <p key={i} className="min-h-[1rem]">{line}</p>
                        ))}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="text-gray-400 text-xs flex items-center gap-1 pl-2">
                    <FaCommentDots className="animate-bounce" /> Thinking...
                </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
                autoFocus
                type="text" 
                placeholder="Ask..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-900"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button 
                type="submit" 
                disabled={!input.trim()}
                className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 disabled:bg-gray-300"
            >
                <FaPaperPlane size={12} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}