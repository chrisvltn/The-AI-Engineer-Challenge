"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Message, ChatSettings } from "../components/types";
import {
  performanceMonitor,
  requestDeduplicator,
  throttle,
} from "../lib/performance";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    apiKey: "",
    developerMessage: "You are a helpful AI assistant.",
    model: "gpt-4.1-mini",
  });
  const [showSettings, setShowSettings] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;

  // Announce new messages to screen readers - optimized with memoization
  useEffect(() => {
    if (lastMessage?.content)
      setAnnouncement(
        `${lastMessage.role === "user" ? "You said" : "AI responded"}: ${
          lastMessage.content
        }`
      );
  }, [lastMessage]);

  // Optimize message updates during streaming using functional updates
  const updateLastMessage = useCallback(
    (updater: (content: string) => string) => {
      setMessages((prev) => {
        if (prev.length === 0) return prev;
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          content: updater(newMessages[lastIndex].content),
        };
        return newMessages;
      });
    },
    []
  );

  // Throttled scroll function to improve performance
  const throttledScroll = useMemo(
    () =>
      throttle(() => {
        const messagesEnd = document.querySelector("[data-messages-end]");
        messagesEnd?.scrollIntoView({ behavior: "smooth" });
      }, 100),
    []
  );

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !settings.apiKey.trim()) return;

    // Start performance monitoring
    performanceMonitor.startRenderTimer();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Use request deduplication to prevent duplicate requests
      const requestKey = `${inputMessage}-${
        settings.model
      }-${settings.apiKey.slice(-8)}`;

      await requestDeduplicator.deduplicate(requestKey, async () => {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            developer_message: settings.developerMessage,
            user_message: inputMessage,
            chat_history: messages,
            model: settings.model,
            api_key: settings.apiKey,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        let aiResponse = "";
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "",
          role: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          aiResponse += chunk;

          // Use the optimized update function
          updateLastMessage(() => aiResponse);
        }
      });

      // Record performance metrics
      const renderTime = performanceMonitor.endRenderTimer();
      performanceMonitor.recordMetrics({
        renderTime,
        messageCount: messages.length + 2, // +2 for user and AI messages
        averageMessageLength: inputMessage.length,
        scrollPerformance: 0, // Will be updated by scroll handler
      });
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content:
          "Sorry, there was an error processing your request. Please check your API key and try again.",
        role: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, settings, messages, updateLastMessage, messages.length]);

  const handleSettingsToggle = useCallback(() => {
    setShowSettings((prev) => {
      const newShowSettings = !prev;
      // Focus management for settings panel
      if (newShowSettings) {
        setTimeout(() => {
          const firstInput = document.querySelector(
            "#api-key-input"
          ) as HTMLInputElement;
          firstInput?.focus();
        }, 100);
      } else {
        settingsButtonRef.current?.focus();
      }
      return newShowSettings;
    });
  }, [settingsButtonRef]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      messages,
      inputMessage,
      isLoading,
      settings,
      showSettings,
      announcement,
      setInputMessage,
      setSettings,
      handleSendMessage,
      handleSettingsToggle,
      settingsButtonRef,
      throttledScroll,
    }),
    [
      messages,
      inputMessage,
      isLoading,
      settings,
      showSettings,
      announcement,
      handleSendMessage,
      handleSettingsToggle,
      throttledScroll,
    ]
  );

  return contextValue;
}
