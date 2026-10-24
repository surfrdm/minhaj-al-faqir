"use client";

import { useState, useEffect, useRef } from "react";
import {
  Edit3,
  Check,
  X,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  Share2,
} from "lucide-react";

function getElementKey(el: HTMLElement): string {
  if (el.id) return `${window.location.pathname}::#${el.id}`;
  const path: string[] = [];
  let current: HTMLElement | null = el;
  while (current && current !== document.body && current.parentElement) {
    const parentEl: HTMLElement = current.parentElement;
    const siblings: HTMLElement[] = Array.from(parentEl.children) as HTMLElement[];
    const sameTagSiblings = siblings.filter(
      (c: HTMLElement) => c.tagName === current!.tagName
    );
    const index = sameTagSiblings.indexOf(current);
    path.unshift(`${current.tagName.toLowerCase()}[${index}]`);
    current = parentEl;
  }
  return `${window.location.pathname}::${path.join(">")}`;
}

function resolveElementFromPath(pathStr: string): HTMLElement | null {
  if (pathStr.startsWith("#")) {
    return document.getElementById(pathStr.slice(1));
  }
  const parts = pathStr.split(">");
  let current: HTMLElement = document.body;
  for (const part of parts) {
    const match = part.match(/^([a-z0-9]+)\[(\d+)\]$/);
    if (!match) return null;
    const [_, tag, idxStr] = match;
    const idx = parseInt(idxStr, 10);
    const siblings: HTMLElement[] = Array.from(current.children) as HTMLElement[];
    const matchingSiblings = siblings.filter(
      (c: HTMLElement) => c.tagName.toLowerCase() === tag
    );
    if (!matchingSiblings[idx]) return null;
    current = matchingSiblings[idx];
  }
  return current;
}

export function WixDirectEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedCount, setUnsavedCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const pendingEditsRef = useRef<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Apply saved edits on mount and on route change
  const applySavedEdits = () => {
    if (typeof window === "undefined") return;

    const applyEditsMap = (edits: Record<string, string>) => {
      const currentPath = window.location.pathname;
      let appliedCount = 0;
      for (const [key, html] of Object.entries(edits)) {
        if (!key.startsWith(`${currentPath}::`)) continue;
        const selectorPath = key.replace(`${currentPath}::`, "");
        const el = resolveElementFromPath(selectorPath);
        if (el && el.innerHTML !== html) {
          el.innerHTML = html;
          appliedCount++;
        }
      }
      return appliedCount;
    };

    // 1. First from localStorage (instant)
    try {
      const local = localStorage.getItem("minhaj_direct_edits");
      if (local) {
        applyEditsMap(JSON.parse(local));
      }
    } catch (e) {}

    // 2. Then sync with server
    fetch("/api/wix-direct-save")
      .then((res) => res.json())
      .then((serverEdits) => {
        if (serverEdits && typeof serverEdits === "object") {
          applyEditsMap(serverEdits);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    applySavedEdits();
    // Re-apply on popstate/navigation
    window.addEventListener("popstate", applySavedEdits);
    return () => window.removeEventListener("popstate", applySavedEdits);
  }, []);

  // Listen to edits during designMode
  useEffect(() => {
    if (!isEditing) return;

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target || target.closest("#wix-editor-bar") || target.closest("#wix-editor-trigger")) {
        return;
      }
      const key = getElementKey(target);
      pendingEditsRef.current[key] = target.innerHTML;
      setUnsavedCount(Object.keys(pendingEditsRef.current).length);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Prevent navigation while editing links
      if (target.tagName.toLowerCase() === "a" || target.closest("a")) {
        e.preventDefault();
      }
    };

    document.addEventListener("input", handleInput, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("input", handleInput, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [isEditing]);

  const toggleEditing = () => {
    if (typeof document === "undefined") return;

    const nextState = !isEditing;
    setIsEditing(nextState);

    if (nextState) {
      document.designMode = "on";
      document.body.classList.add("wix-edit-active");
      showToast("✏️ وضع Wix نشط! انقر على أي نص على الشاشة واكتب لتعديله مباشرة.");
    } else {
      document.designMode = "off";
      document.body.classList.remove("wix-edit-active");
      showToast("✓ تم إيقاف وضع التعديل.");
    }
  };

  const handleSaveAll = async () => {
    if (typeof window === "undefined") return;

    try {
      // 1. Save to localStorage
      let existing: Record<string, string> = {};
      try {
        const local = localStorage.getItem("minhaj_direct_edits");
        if (local) existing = JSON.parse(local);
      } catch (e) {}

      const merged = { ...existing, ...pendingEditsRef.current };
      localStorage.setItem("minhaj_direct_edits", JSON.stringify(merged));

      // 2. Save to server file
      await fetch("/api/wix-direct-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingEditsRef.current),
      });

      pendingEditsRef.current = {};
      setUnsavedCount(0);
      setIsEditing(false);
      document.designMode = "off";
      document.body.classList.remove("wix-edit-active");

      showToast("✓ تم حفظ جميع تعديلاتك بنجاح في الموقع!");
    } catch (e) {
      showToast("حدث خطأ أثناء حفظ التعديلات.");
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window === "undefined") return;
    const local = localStorage.getItem("minhaj_direct_edits");
    let msg = `السلام عليكم، قمت بإجراء تعديلات على منصة منهاج الفقير (${window.location.href}):\n\n`;
    if (local) {
      try {
        const edits = JSON.parse(local);
        const keys = Object.keys(edits).filter((k) =>
          k.startsWith(`${window.location.pathname}::`)
        );
        if (keys.length > 0) {
          msg += `عدد التعديلات التي قمت بها في هذه الصفحة: ${keys.length}\n`;
          keys.slice(0, 4).forEach((k, i) => {
            const tmp = document.createElement("div");
            tmp.innerHTML = edits[k];
            const textSnippet = tmp.textContent?.trim().slice(0, 90);
            msg += `• (${i + 1}): «${textSnippet}»\n`;
          });
        }
      } catch (e) {}
    }
    msg += `\nيرجى اعتماد هذه التعديلات ونشرها.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleReset = () => {
    if (typeof window === "undefined") return;
    if (confirm("هل تريد حقاً استرجاع النصوص الأصلية لهذه الصفحة؟")) {
      try {
        const local = localStorage.getItem("minhaj_direct_edits");
        if (local) {
          const edits = JSON.parse(local);
          const currentPath = window.location.pathname;
          for (const key of Object.keys(edits)) {
            if (key.startsWith(`${currentPath}::`)) {
              delete edits[key];
            }
          }
          localStorage.setItem("minhaj_direct_edits", JSON.stringify(edits));
        }
      } catch (e) {}
      window.location.reload();
    }
  };

  return (
    <>
      {/* Dynamic Style for Hover Effect during Wix Edit Mode */}
      <style jsx global>{`
        body.wix-edit-active *:hover:not(#wix-editor-bar *):not(#wix-editor-trigger *):not(button):not(svg):not(path) {
          outline: 2px dashed #C5A059 !important;
          outline-offset: 3px !important;
          cursor: text !important;
          background-color: rgba(197, 160, 89, 0.08) !important;
          transition: background-color 0.15s ease;
        }
      `}</style>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#143628] text-[#FAF7F2] border-2 border-[#C5A059] px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 font-sans text-xs sm:text-sm">
          <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Floating Save / Control Bar at Top when Editing */}
      {isEditing && (
        <div
          id="wix-editor-bar"
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-[#FAF7F2] border-b-2 border-[#C5A059] px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-sans"
          dir="rtl"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-[#E5C378]">
              وضع التعديل المباشر كـ Wix مفعّل:
            </span>
            <span className="hidden md:inline text-white/90">
              انقر على أي نص تريده في هذه الصفحة وعدّله باللوحة مباشرة كما في Word وWix.
            </span>
            {unsavedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#C5A059] text-[#143628] font-bold text-xs">
                {unsavedCount} تعديلات جديدة
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C378] text-[#143628] font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#143628]" />
              <span>حفظ في المتصفح</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
              title="إرسال التعديلات عبر واتساب للمصمم/المشرف لاعتمادها"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>إرسال التعديلات عبر واتساب</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white/90 font-medium text-xs flex items-center gap-1 transition cursor-pointer"
              title="استرجاع النص الأصلي للصفحة"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">استرجاع الأصل</span>
            </button>

            <button
              onClick={toggleEditing}
              className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>إنهاء</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Single Wix Icon Trigger (Bottom-Left) */}
      <div
        id="wix-editor-trigger"
        className="fixed bottom-6 left-6 z-40 flex items-center"
        dir="rtl"
      >
        <button
          onClick={toggleEditing}
          className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full border-2 shadow-2xl transition-all duration-300 cursor-pointer ${
            isEditing
              ? "bg-[#C5A059] text-[#143628] border-white scale-105 ring-4 ring-[#C5A059]/40"
              : "bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] border-[#C5A059] hover:scale-105 active:scale-95"
          }`}
          title="انقر لتفعيل تعديل أي نص في هذه الصفحة مباشرة كما في Wix"
        >
          <div
            className={`p-1 rounded-full transition ${
              isEditing ? "bg-[#143628] text-[#C5A059]" : "bg-[#C5A059] text-[#143628]"
            }`}
          >
            <Edit3 className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs sm:text-sm">
            {isEditing ? "✏️ وضع التعديل نَشِط (انقر واكتب)" : "✏️ تعديل النصوص مباشرة (مثل Wix)"}
          </span>
        </button>
      </div>
    </>
  );
}
