'use client';
import { useState, useRef, useEffect } from 'react';
import useAxios from '@/hooks/useAxios';
import { useCart } from '@/context/CartContext'; // <--- 1. Import Cart Context
import { useRouter } from 'next/navigation'; // <--- Import Router
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots, FaHandSparkles } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast'; // <--- 2. Import Toast

export default function ChatBot() {
  const { fetchCart } = useCart(); // <--- 3. Get the update function
  const router = useRouter(); // <--- Init Router
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hi! I can handle Subscriptions, Checkout, and more! 🚀", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const axios = useAxios();

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        // Send to Backend
        const { data } = await axios.post('/ai/chat', { 
            message: userMsg.text,
            history: messages 
        });
        
        setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);

        // 1. UPDATE CART (If items added/removed/cleared)
        if (data.reply.includes("Done") || data.reply.includes("Success")) {
            console.log("AI action completed. Updating Global Cart...");
            await fetchCart();
            toast.success("Cart Updated!", {
                icon: '🛒',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                position: "bottom-center"
            });
        }

        // 2. OPEN CHECKOUT MODAL (If AI says so)
        if (data.reply.includes("OPEN_CHECKOUT_MODAL")) {
            toast("Opening Checkout...", { icon: '📝' });
            setIsOpen(false);
            router.push('/cart?openCheckout=true'); // <--- Redirect with Flag
        }

    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { text: "My brain is offline.", sender: 'bot' }]);
    } finally {
        setLoading(false);
    }
  };

  const renderMessageContent = (text) => {
    const lines = text.split('\n');
    const blocks = [];
    let listItems = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      const bulletMatch = /^[-*•]\s+(.+)/.exec(trimmed);

      if (bulletMatch) {
        listItems.push(bulletMatch[1]);
        return;
      }

      if (listItems.length) {
        blocks.push({ type: 'list', items: listItems });
        listItems = [];
      }

      if (trimmed) {
        blocks.push({ type: 'paragraph', text: trimmed });
      }
    });

    if (listItems.length) {
      blocks.push({ type: 'list', items: listItems });
    }

    return blocks.map((block, idx) => {
      if (block.type === 'list') {
        return (
          <ul key={`list-${idx}`} className="list-disc pl-5 space-y-1 leading-relaxed">
            {block.items.map((item, liIdx) => (
              <li key={`list-${idx}-item-${liIdx}`} className="text-sm md:text-[13px] text-inherit">
                {item}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={`p-${idx}`} className="text-sm md:text-[13px] leading-relaxed whitespace-pre-line">
          {block.text}
        </p>
      );
    });
  };

  return (
    <div className="relative z-50">
      {/* Toast Container (Required for toasts to show) */}
      <Toaster />

      {/* NAVBAR BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${
            isOpen 
            ? 'bg-green-100 text-green-700 font-bold' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'
        }`}
      >
        <FaHandSparkles className={isOpen ? "text-green-600 text-xl animate-pulse" : " text-xl text-yellow-500 animate-pulse"} />
        <span className="md:hidden text-xs font-semibold text-gray-700">AI</span>
        <span className="hidden md:inline font-bold text-xl bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] hover:scale-105 transition-transform drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
          Shop with our AI
        </span>
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed top-20 left-4 right-4 md:absolute md:top-full md:right-0 md:left-auto mt-3 md:mt-3 w-auto md:w-96 max-w-[520px] h-[70vh] md:h-[450px] max-h-[520px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-down origin-top-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 flex justify-between items-center text-white shadow-sm sticky top-0 z-10">
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
                <div className={`max-w-[85%] p-2.5 rounded-2xl text-sm shadow-sm space-y-2 ${
                        msg.sender === 'user' 
                        ? 'bg-green-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    }`}>
                  {renderMessageContent(msg.text)}
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
                className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
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