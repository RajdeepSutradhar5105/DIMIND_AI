"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { EmptyState } from "@/components/EmptyState";
import { ChatMessage, type UIMessage } from "@/components/ChatMessage";
import { ThinkingIndicator } from "@/components/ThinkingIndicator";
import { Composer } from "@/components/Composer";
import type { ChatApiResponse, ChatMessage as ApiChatMessage } from "@/lib/types";
import { loadHistory, saveHistory, clearHistory } from "@/lib/storage";

function looksLikeRawJson(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return false;
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Home() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load any saved conversation once the component mounts on the client.
  // Deferring this to an effect (rather than a useState initializer) keeps
  // the server-rendered and first client-rendered markup identical, so
  // there's no hydration mismatch — the saved chat just fades in a moment
  // after the page loads.
  useEffect(() => {
    const stored = loadHistory();
    if (stored.length > 0) setMessages(stored);
    setHydrated(true);
  }, []);

  // Persist every change, but only after the initial load above has run —
  // otherwise this would immediately overwrite saved history with `[]`.
  useEffect(() => {
    if (!hydrated) return;
    saveHistory(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  function handleClear() {
    setMessages([]);
    clearHistory();
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const userMessage: UIMessage = { id: makeId(), role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsThinking(true);

    try {
      const apiHistory: ApiChatMessage[] = nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiHistory }),
      });

      const data: ChatApiResponse & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            content: data.error || "Something went wrong. Please try again.",
            isError: true,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: looksLikeRawJson(data.reply)
            ? "I ran into trouble phrasing that answer — could you try asking again?"
            : data.reply,
          tools: data.tools,
          attachments: data.attachments,
        },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: `Network error: ${e?.message ?? e}`,
          isError: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  const userCount = messages.filter((m) => m.role === "user").length;

  return (
    <div className="flex min-h-screen flex-col">
      <Header onClear={handleClear} hasMessages={messages.length > 0} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 gap-6 px-4 py-6 sm:px-6">
        <Sidebar messageCount={messages.length} userCount={userCount} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1">
            {messages.length === 0 ? (
              <EmptyState onPick={(text) => sendMessage(text)} />
            ) : (
              <div className="flex flex-col gap-5 pb-4">
                {messages.map((m) => (
                  <ChatMessage key={m.id} message={m} />
                ))}
                {isThinking && <ThinkingIndicator />}
                <div ref={scrollRef} />
              </div>
            )}
          </div>

          <Composer
            value={input}
            onChange={setInput}
            onSubmit={() => sendMessage(input)}
            disabled={isThinking}
          />
        </div>
      </main>
    </div>
  );
}
