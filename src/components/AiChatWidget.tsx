"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Compass,
  ArrowUpRight,
  BookOpen,
  Video,
  ExternalLink,
  ChevronDown,
  Minimize2,
} from "lucide-react";

interface ChatCard {
  title: string;
  type: "link" | "book" | "video";
  url: string;
  badge?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  cards?: ChatCard[];
  time: string;
}

const QUICK_QUESTIONS = [
  "ما الدليل على جواز السبحة؟",
  "كيف تؤدى جلسة 15,000 هيللة؟",
  "ما هو أصل العمارة والذكر الجماعي؟",
  "حدثني عن سيرة الشيخ سيدي منير",
  "ما هي مراحل المسار التكويني؟",
];

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "السلام عليكم ورحمة الله وبركاته أخي السالك. أنا «مُرْشِدُ المِنْهَاجِ»، رفيقك الذكي للإجابة عن أسئلة الفقه والسلوك وأصول الطريقة القادرية البودشيشية. كيف أتشرف بخدمتك اليوم؟",
      time: "الآن",
      cards: [
        { title: "المسار التكويني (المراحل الست)", type: "link", url: "/masar", badge: "تكوين" },
        { title: "دروس السبت لفضيلة الشيخ", type: "video", url: "/dourous", badge: "محاضرات" },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply || "تقبل الله طاعاتكم ونفعنا ببركتكم.",
          cards: data.cards || [],
          time: new Date().toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("Chat response error");
      }
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "نعتذر، حدث اضطراب في الاتصال. يمكنك إعادة السؤال أو تصفح أقسام المنصة مباشرة.",
        time: "الآن",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Bottom Left in RTL, fixed) */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3" dir="rtl">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#1B4332] text-white shadow-2xl hover:shadow-[#C5A059]/30 border-2 border-[#C5A059] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            aria-label="اسأل مرشد المنهاج الذكي"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-[#C5A059] animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#1B4332]" />
            </div>
            <span className="font-amiri text-sm font-bold tracking-wide hidden sm:inline text-[#FAF7F2]">
              اسأل مرشد المنهاج
            </span>
          </button>
        )}
      </div>

      {/* CHAT WINDOW MODAL */}
      {isOpen && (
        <div
          className="fixed bottom-6 left-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl bg-[#FAF7F2] dark:bg-[#07130E] border-2 border-[#C5A059]/60 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
          dir="rtl"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#143628] to-[#1B4332] text-white flex items-center justify-between border-b border-[#C5A059]/40 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-amiri text-base font-bold text-[#FAF7F2]">
                  مُرْشِدُ المِنْهَاجِ الذَّكِيُّ
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>متصل • مدعوم بـ Gemini 2.5</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="تصغير المحادثة"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-start" : "items-end"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-[#1B4332] text-[#FAF7F2] rounded-tr-none shadow-sm"
                      : "bg-white dark:bg-[#0E2019] text-[#1D2A24] dark:text-[#E8F0EC] border border-[#E7DFD5] dark:border-[#203D31] rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="font-ibm leading-relaxed">{m.text}</p>

                  {/* Cards inside bot message */}
                  {m.cards && m.cards.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#E7DFD5] dark:border-[#203D31] space-y-1.5">
                      <span className="text-[10px] text-[#C5A059] font-bold block">
                        روابط ومراجع مقترحة:
                      </span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {m.cards.map((c, idx) => (
                          <Link
                            key={idx}
                            href={c.url}
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/30 hover:border-[#C5A059] flex items-center justify-between transition group text-right"
                          >
                            <div className="flex items-center gap-2">
                              {c.type === "video" ? (
                                <Video className="w-3.5 h-3.5 text-[#C5A059]" />
                              ) : (
                                <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                              )}
                              <span className="font-bold text-[11px] text-[#143628] dark:text-[#E8F0EC] group-hover:text-[#C5A059] transition">
                                {c.title}
                              </span>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] font-bold shrink-0">
                              {c.badge || "عرض"}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-gray-400 px-1 mt-0.5">{m.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] w-24">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="px-3 py-2 border-t border-[#E7DFD5] dark:border-[#203D31] bg-white/60 dark:bg-black/20 flex gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#143628] dark:text-[#E5C378] border border-[#C5A059]/30 shrink-0 transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-[#0E2019] border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك في فقه أو أوراد الطريق..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#1D2A24] dark:text-[#E8F0EC] focus:outline-none focus:border-[#C5A059]"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-white disabled:opacity-40 transition cursor-pointer shadow-sm"
              title="إرسال"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
