"use client";

import { useState, useRef, useEffect } from "react";
import { useAI } from "@/hooks/useAI";
import { ArrowLeft, Loader2, MoreVertical, Plus, Mic, Send, X, Crown, AlertCircle, Bot, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AssistantPage() {
  const { t } = useLanguage();
  const { messages, sendMessage, isLoading, error, messagesUsed, messagesLimit, isPremium, canSendMessage } = useAI();

  const quickActions = [
    t("assistant.quick.eat"),
    t("assistant.quick.visit"),
  ];
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const limitError = !canSendMessage();



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() && !isLoading && canSendMessage()) {
      sendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleQuickAction = (text: string) => {
    if (canSendMessage()) {
      sendMessage(text);
    }
  };

  const remainingMessages = isPremium ? "∞" : messagesLimit - messagesUsed;

  return (
    <div className="min-h-screen bg-moroccan-light flex flex-col" style={{
      backgroundImage: 'radial-gradient(circle, rgba(255, 249, 230, 0.4) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">{t("assistant.title")}</h1>
            <div className="flex items-center gap-2">
              <Link href="/offres" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Crown className="w-6 h-6 text-moroccan-gold" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        {messages.length === 0 && (
          <div className="flex gap-3 mb-4 justify-start">
            <div className="w-10 h-10 rounded-full bg-green-800/10 flex-shrink-0 flex items-center justify-center">
              <Bot className="w-6 h-6 text-green-800" />
            </div>
            <div className="max-w-[75%] rounded-2xl rounded-bl-none bg-white shadow-sm text-gray-900 px-4 py-3">
              <p className="text-sm">
                {t("assistant.welcome")}
              </p>
            </div>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-10 h-10 rounded-full bg-moroccan-blue/10 flex-shrink-0 flex items-center justify-center">
                <Bot className="w-6 h-6 text-moroccan-blue" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === "user"
                ? "bg-moroccan-blue text-white rounded-br-none"
                : "bg-white text-gray-900 rounded-bl-none"
                }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 mb-4 justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                AI
              </div>
            </div>
            <div className="bg-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Limit Error */}
      {limitError && (
        <div className="px-4 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">
                {t("assistant.limit.title")}
              </p>
              <p className="text-xs text-red-700 mb-3">
                {t("assistant.limit.message", { limit: messagesLimit })}
              </p>
              <Link
                href="/offres"
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                {t("assistant.limit.upgrade")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {messages.length <= 2 && !limitError && (
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                disabled={isLoading || limitError}
                className="bg-blue-100 text-gray-900 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              // onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("assistant.placeholder")}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-800 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading || limitError}
              className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}