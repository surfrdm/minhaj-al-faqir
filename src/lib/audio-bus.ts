"use client";

type StopCallback = () => void;

class GlobalAudioBus {
  private activeId: string | null = null;
  private stopCallback: StopCallback | null = null;
  private activeHtmlAudio: HTMLAudioElement | null = null;
  private activeObjectUrl: string | null = null;

  claim(id: string, onStop: StopCallback) {
    if (this.activeId && this.activeId !== id) {
      this.stopAll();
    } else if (this.activeId === id) {
      this.stopCurrentEngineOnly();
    }
    this.activeId = id;
    this.stopCallback = onStop;
  }

  registerHtmlAudio(audio: HTMLAudioElement, objectUrl?: string) {
    if (this.activeHtmlAudio && this.activeHtmlAudio !== audio) {
      try {
        this.activeHtmlAudio.pause();
        this.activeHtmlAudio.currentTime = 0;
      } catch {
        // Ignore
      }
    }
    if (this.activeObjectUrl && this.activeObjectUrl !== objectUrl) {
      try {
        URL.revokeObjectURL(this.activeObjectUrl);
      } catch {
        // Ignore
      }
    }
    this.activeHtmlAudio = audio;
    this.activeObjectUrl = objectUrl || null;
  }

  stopCurrentEngineOnly() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    if (this.activeHtmlAudio) {
      try {
        this.activeHtmlAudio.pause();
        this.activeHtmlAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.activeHtmlAudio = null;
    }
    if (this.activeObjectUrl) {
      try {
        URL.revokeObjectURL(this.activeObjectUrl);
      } catch {
        // Ignore
      }
      this.activeObjectUrl = null;
    }
  }

  stopAll(exceptId?: string) {
    if (exceptId && this.activeId === exceptId) return;
    this.stopCurrentEngineOnly();
    const cb = this.stopCallback;
    this.activeId = null;
    this.stopCallback = null;
    if (cb) cb();
  }

  release(id: string) {
    if (this.activeId === id) {
      this.stopCurrentEngineOnly();
      this.activeId = null;
      this.stopCallback = null;
    }
  }
}

export const audioBus = new GlobalAudioBus();

export function pickPreferredSpeechVoice(
  lang: "ar" | "fr" | "en"
): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === "ar") {
    const priorities = ["ar-MA", "ar-SA", "ar-001", "ar-EG", "ar-AE", "ar"];
    for (const p of priorities) {
      const found = voices.find((v) =>
        v.lang.toLowerCase().startsWith(p.toLowerCase())
      );
      if (found) return found;
    }
    const majed = voices.find((v) =>
      /majed|tarik|maged|laila|sana|arabic/i.test(v.name)
    );
    if (majed) return majed;
  }

  const prefix = lang === "fr" ? "fr" : lang === "en" ? "en" : "ar";
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
    null
  );
}
