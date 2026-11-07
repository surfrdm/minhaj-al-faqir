"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

/**
 * درع الحماية ضد النسخ والتجريف والهندسة العكسية (Anti-Theft & Anti-Scraping Shield)
 * يمنع أدوات التفتيش، وزر الفأرة الأيمن، واختصارات المتصفح لنسخ الأكواد والتصاميم.
 */
export function AntiTheftShield() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // 1. طباعة تحذير الأمان الصارم في كونسول المتصفح
    try {
      console.clear();
      console.log(
        "%c🔒 مَصُونٌ بِحِمَى الشَّرِيعَةِ وَالأَمَانَةِ العِلْمِيَّةِ\n%cجميع الأكواد والتصاميم في منصة «مِنْهَاجُ الفَقِير» محمية بحقوق الملكية الفكرية والأمانة الشرعية.\nيُمنع منعاً باتاً أي محاولة للهندسة العكسية، أو التجريف الآلي، أو استنساخ الواجهات والبيانات.\nAll rights reserved. Automated cloning and reverse-engineering are strictly prohibited.",
        "font-size: 18px; font-weight: bold; color: #C5A059; background: #143628; padding: 10px 16px; border-radius: 8px; border: 2px solid #C5A059;",
        "font-size: 12px; color: #826122; font-family: sans-serif; line-height: 1.6;"
      );
    } catch {
      // ignore
    }

    // 2. دالة إظهار التنبيه الذهبي
    const triggerWarning = () => {
      setShowWarning(true);
      const timer = setTimeout(() => setShowWarning(false), 3000);
      return () => clearTimeout(timer);
    };

    // 3. اعتراض القائمة المنبثقة بالزر الأيمن (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      // استثناء إذا كان المستخدم يحدد نصاً للنسخ العادي في القرآن
      const target = e.target as HTMLElement | null;
      if (target?.closest(".select-text")) {
        return; // السماح بنسخ الآيات الشريفة
      }
      e.preventDefault();
      triggerWarning();
    };

    // 4. اعتراض اختصارات المطورين والتفتيش في لوحة المفاتيح
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // F12 (Inspect)
      if (e.key === "F12") {
        e.preventDefault();
        triggerWarning();
        return;
      }

      // Ctrl/Cmd + Shift + I (DevTools)
      // Ctrl/Cmd + Shift + J (Console)
      // Ctrl/Cmd + Shift + C (Element Inspector)
      if (cmdOrCtrl && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) {
        e.preventDefault();
        triggerWarning();
        return;
      }

      // Ctrl/Cmd + U (View Source)
      if (cmdOrCtrl && ["U", "u"].includes(e.key)) {
        e.preventDefault();
        triggerWarning();
        return;
      }

      // Ctrl/Cmd + S (Save Page)
      if (cmdOrCtrl && ["S", "s"].includes(e.key)) {
        e.preventDefault();
        triggerWarning();
        return;
      }
    };

    // 5. منع سحب وإسقاط الصور أو العناصر الحساسة
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "IMG" || target?.classList.contains("no-drag")) {
        e.preventDefault();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("dragstart", handleDragStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  if (!showWarning) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl bg-[#143628] text-[#FAF7F2] border-2 border-[#C5A059] shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fade-in pointer-events-none select-none"
    >
      <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#E5C378] shrink-0">
        <ShieldAlert className="w-4 h-4" />
      </div>
      <div>
        <div className="font-amiri text-sm font-bold text-[#E5C378]">
          مَصُونٌ بِحِمَى الأَمَانَةِ العِلْمِيَّةِ 🔒
        </div>
        <div className="font-ibm text-xs text-[#E8F0EC]/80">
          محتوى وتصميم المنصة محمي ضد النسخ والهندسة العكسية.
        </div>
      </div>
    </div>
  );
}
