"use client";

import { useEffect } from "react";
import {
  getStoredToken,
  getStoredUser,
  setStoredUser,
  updateProfile,
} from "@/lib/api";
import { detectTimezone } from "@/lib/timezone";

/** Keeps the account timezone equal to the device's, without asking. */
export function TimezoneSync() {
  useEffect(() => {
    const detected = detectTimezone();
    const user = getStoredUser();
    if (!detected || !getStoredToken() || !user || user.timezone === detected) {
      return;
    }
    updateProfile({ timezone: detected })
      .then(setStoredUser)
      .catch(() => {
        /* retried on the next visit */
      });
  }, []);
  return null;
}
