"use client";

import React, { useEffect, useState } from "react";
import {
  OPEN_MEMBER_PORTAL_EVENT,
  type MemberPortalView,
} from "@/lib/member-session";
import { MemberPortalModal } from "@/components/MemberPortalModal";

export function GlobalMemberPortalHost() {
  const [isOpen, setIsOpen] = useState(false);
  const [initialView, setInitialView] = useState<MemberPortalView>("dashboard");
  const [openKey, setOpenKey] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ view?: MemberPortalView }>;
      setInitialView(ce?.detail?.view || "dashboard");
      setOpenKey((k) => k + 1);
      setIsOpen(true);
    };
    window.addEventListener(OPEN_MEMBER_PORTAL_EVENT, handler);
    return () => {
      window.removeEventListener(OPEN_MEMBER_PORTAL_EVENT, handler);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <MemberPortalModal
      key={openKey}
      isOpen={isOpen}
      initialView={initialView}
      onClose={() => setIsOpen(false)}
    />
  );
}
