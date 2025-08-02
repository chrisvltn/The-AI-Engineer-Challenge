"use client";

import { useRef, useCallback, useMemo } from "react";
import { Send } from "lucide-react";
import { useChatContext } from "../context/ChatContext";

export default function MessageInput() {
  const {
    inputMessage,
    setInputMessage,
    handleSendMessage,
    settings,
    isLoading,
  } = useChatContext();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = !inputMessage.trim() || !settings.apiKey.trim() || isLoading;
  const hasApiKey = settings.apiKey.trim().length > 0;

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage();
    },
    [handleSendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputMessage(e.target.value);
    },
    [setInputMessage]
  );

  return (
    <div
      className="p-3 md:p-6 border-t border-boho-200 bg-white/40"
      role="form"
      aria-label="Message input"
    >
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <label htmlFor="message-input" className="sr-only">
          Type your message
        </label>
        <textarea
          ref={inputRef}
          id="message-input"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="input-field resize-none min-h-[60px] max-h-[120px] placeholder:text-sage-500 pr-12 flex-1"
          rows={1}
          name="message"
          aria-label="Chat message"
          aria-describedby="message-help"
          disabled={!hasApiKey}
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="absolute right-3 w-8 h-8 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-400 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
          aria-label="Send message"
          aria-describedby="send-help"
        >
          <Send className="w-4 h-4 text-white" aria-hidden="true" />
        </button>
      </form>
      <div id="message-help" className="text-sm text-sage-600 mt-2">
        <HelpText hasApiKey={hasApiKey} />
      </div>
      <div id="send-help" className="sr-only">
        Click to send your message
      </div>
    </div>
  );
}

const HelpText = ({ hasApiKey }: { hasApiKey: boolean }) => {
  if (!hasApiKey)
    return (
      <p role="alert">
        ⚠️ Please enter your OpenAI API key in settings to start chatting
      </p>
    );
  return <p>Press Enter to send, Shift+Enter for new line</p>;
};
