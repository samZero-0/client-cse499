'use client';
import { OPEN_ASSISTANT_EVENT } from './ChatBot';

/** Opens the floating assistant, optionally pre-filling the message box. */
export default function OpenAssistantButton({ className, message, children }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT, { detail: { message } }))}
      className={className}
    >
      {children}
    </button>
  );
}
