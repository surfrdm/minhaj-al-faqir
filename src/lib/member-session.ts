"use client";

import { useSyncExternalStore } from "react";

export interface MemberSession {
  memberId: string;
  name: string;
  city: string;
  monthly: number;
  paidMonths: number;
  annualPaid: number;
  status: string;
  isAdmin: boolean;
  adminPin?: string;
}

export const MEMBER_SESSION_STORAGE_KEY = "minhaj_member_session_v1";
export const MEMBER_SESSION_EVENT = "minhaj-member-changed";
export const OPEN_MEMBER_PORTAL_EVENT = "minhaj-open-member-portal";

export type MemberPortalView = "dashboard" | "login" | "register" | "admin";

export function isActiveSubscriber(session: MemberSession | null): boolean {
  if (!session) return false;
  if (session.isAdmin) return true;
  if (session.paidMonths > 0 || session.annualPaid > 0) return true;
  if (session.status && session.status.includes("ممتثل")) return true;
  return false;
}

export function getStoredMemberSession(): MemberSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MEMBER_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MemberSession;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

let cachedRawSession: string | null | undefined = undefined;
let cachedParsedSession: MemberSession | null = null;

function readCachedSnapshot(): MemberSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MEMBER_SESSION_STORAGE_KEY);
    if (raw === cachedRawSession) {
      return cachedParsedSession;
    }
    cachedRawSession = raw;
    if (!raw) {
      cachedParsedSession = null;
      return null;
    }
    const parsed = JSON.parse(raw) as MemberSession;
    cachedParsedSession = parsed && typeof parsed === "object" ? parsed : null;
    return cachedParsedSession;
  } catch {
    cachedRawSession = null;
    cachedParsedSession = null;
    return null;
  }
}

function getServerSessionSnapshot(): MemberSession | null {
  return null;
}

function subscribeToMemberSession(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onCustom = () => {
    cachedRawSession = undefined;
    onStoreChange();
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key === MEMBER_SESSION_STORAGE_KEY || e.key === null) {
      cachedRawSession = undefined;
      onStoreChange();
    }
  };

  window.addEventListener(MEMBER_SESSION_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(MEMBER_SESSION_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

const subscribeNoop = () => () => {};
const getClientHydrated = () => true;
const getServerHydrated = () => false;

export function setStoredMemberSession(session: MemberSession | null): void {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      window.localStorage.setItem(
        MEMBER_SESSION_STORAGE_KEY,
        JSON.stringify(session)
      );
    } else {
      window.localStorage.removeItem(MEMBER_SESSION_STORAGE_KEY);
    }
    cachedRawSession = undefined;
    window.dispatchEvent(
      new CustomEvent(MEMBER_SESSION_EVENT, { detail: session })
    );
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

export function openMemberPortal(view: MemberPortalView = "login"): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(OPEN_MEMBER_PORTAL_EVENT, { detail: { view } })
  );
}

export function useMemberSession(): {
  session: MemberSession | null;
  isSubscriber: boolean;
  hydrated: boolean;
} {
  const session = useSyncExternalStore(
    subscribeToMemberSession,
    readCachedSnapshot,
    getServerSessionSnapshot
  );
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getClientHydrated,
    getServerHydrated
  );

  return {
    session,
    isSubscriber: hydrated ? isActiveSubscriber(session) : false,
    hydrated,
  };
}
