"use client";

import { useEffect } from "react";

export function DisableDraftMode() {
  useEffect(() => {
    fetch("/api/draft-mode/disable").catch(() => null);
  }, []);

  return null;
}
