'use client';
import { useState, useRef, useEffect } from 'react';
import useAxios from '@/hooks/useAxios';
import { useCart } from '@/context/CartContext';
import { useRouter, usePathname } from 'next/navigation';

// Dispatch this event anywhere on the page to open the assistant
export const OPEN_ASSISTANT_EVENT = 'pantrypal:open-assistant';
// Fired after the assistant changes the cart or subscription so open pages can reload
export const DATA_CHANGED_EVENT = 'pantrypal:data-changed';
// Asks an already-open cart page to show its checkout form
export const OPEN_CHECKOUT_EVENT = 'pantrypal:open-checkout';

const suggestions = ['Add milk, eggs and bread', 'Set up a weekly bundle', 'Check out my cart'];

export function AssistantMark({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7 25C7 14.5 13.5 7 25 7c0 11.5-7.5 18-18 18Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M7 25 18.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatBot() {
  const { fetchCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Hi! I can help you shop, set up subscriptions, and check out.',
      sender: 'bot',
    },
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

  // Open from elsewhere on the page; close with Escape
  useEffect(() => {
    const open = (e) => {
      setIsOpen(true);
      if (e.detail?.message) setInput(e.detail.message);
    };
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener(OPEN_ASSISTANT_EVENT, open);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_ASSISTANT_EVENT, open);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // The server reports what its tools changed: { cartChanged, subscriptionChanged, openCheckout }
    const applyActions = async (actions = {}) => {
      if (actions.cartChanged) await fetchCart();
      if (actions.cartChanged || actions.subscriptionChanged) window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
      if (actions.openCheckout) {
        setIsOpen(false);
        if (pathname === '/cart') window.dispatchEvent(new Event(OPEN_CHECKOUT_EVENT));
        else router.push('/cart?openCheckout=true');
      }
    };

    try {
      const { data } = await axios.post('/ai/chat', {
        message: userMsg.text,
        history: messages,
      });
      setMessages((prev) => [...prev, { text: data.reply, sender: 'bot' }]);
      await applyActions(data.actions);
    } catch (error) {
      const data = error.response?.data;
      setMessages((prev) => [
        ...prev,
        { text: data?.reply || 'Sorry, I could not reach the assistant. Please try again.', sender: 'bot' },
      ]);
      // Some tools may have run before the failure
      await applyActions(data?.actions);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
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
          <ul key={`list-${idx}`} className="list-disc space-y-1 pl-5 leading-relaxed">
            {block.items.map((item, liIdx) => (
              <li key={`list-${idx}-item-${liIdx}`} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={`p-${idx}`} className="whitespace-pre-line text-sm leading-relaxed">
          {block.text}
        </p>
      );
    });
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="PantryPal Assistant"
          className="fixed inset-x-3 bottom-24 z-[70] flex h-[min(600px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface text-ink shadow-2xl shadow-black/20 animate-fade-in-up sm:inset-x-auto sm:right-6 sm:w-[400px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-5 py-4 text-on-primary">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-on-primary/15">
              <AssistantMark className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold tracking-tight">PantryPal Assistant</h3>
              <p className="text-xs opacity-75">Shop, subscribe and check out by chat</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-on-primary/15"
            >
              Close
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-canvas p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] space-y-2 rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'user'
                      ? 'rounded-br-md bg-primary text-on-primary'
                      : 'rounded-tl-md border border-line bg-surface text-ink'
                  }`}
                >
                  {renderMessageContent(msg.text)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3.5" aria-label="Assistant is typing">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted"
                      style={{ animationDelay: `${dot * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-olive"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex gap-2 border-t border-line bg-surface p-3">
            <label htmlFor="assistant-input" className="sr-only">
              Message the assistant
            </label>
            <input
              id="assistant-input"
              autoFocus
              type="text"
              autoComplete="off"
              placeholder="Ask for groceries, a bundle, or checkout..."
              className="min-w-0 flex-1 rounded-full border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-full bg-primary px-5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating launcher */}
      <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 sm:bottom-6 sm:right-6">
        {!isOpen && (
          <span className="pointer-events-none hidden rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-black/5 sm:block assistant-hint">
            Ask PantryPal
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close assistant' : 'Open shopping assistant'}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl shadow-black/25 transition-transform duration-300 hover:scale-105 ${
            isOpen ? '' : 'assistant-float'
          }`}
        >
          {!isOpen && (
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/40 assistant-ping" />
          )}
          {isOpen ? (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative h-6 w-6">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            <AssistantMark className="relative h-8 w-8 transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </button>
      </div>
    </>
  );
}
