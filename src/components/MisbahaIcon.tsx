import React from "react";

export function MisbahaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* 9 Main Beads in circular prayer loop */}
      <circle cx="12" cy="4.5" r="1.6" fill="currentColor" fillOpacity="0.25" />
      <circle cx="16.5" cy="6" r="1.6" fill="currentColor" fillOpacity="0.25" />
      <circle cx="19" cy="9.8" r="1.6" fill="currentColor" fillOpacity="0.25" />
      <circle cx="18.2" cy="14" r="1.6" fill="currentColor" fillOpacity="0.25" />
      <circle cx="14.8" cy="16.8" r="1.6" fill="currentColor" fillOpacity="0.25" />
      <circle cx="9.2" cy="16.8" r="1.6" fill="currentColor" fillOpacity="0.25" />
      <circle cx="5.8" cy="14" r="1.6" fill="currentColor" fillOpacity="0.25" />
      <circle cx="5" cy="9.8" r="1.6" fill="currentColor" fillOpacity="0.25" />
      <circle cx="7.5" cy="6" r="1.6" fill="currentColor" fillOpacity="0.25" />

      {/* Subtle loop cord connecting beads */}
      <ellipse cx="12" cy="11" rx="6.4" ry="5.8" strokeDasharray="1.5 2" strokeOpacity="0.6" />

      {/* Imamah / Minaret Top Joint (شاهد السبحة) */}
      <path d="M12 17.5v2" strokeWidth="2" />
      <circle cx="12" cy="19.5" r="0.8" fill="currentColor" />

      {/* Decorative Tassel (الشرابة الملكية) */}
      <path d="M12 20.3v2.2" />
      <path d="M10.2 23.5h3.6" />
      <path d="M11 21.2l-1 2.3" />
      <path d="M13 21.2l1 2.3" />
    </svg>
  );
}
