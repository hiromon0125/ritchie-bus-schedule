"use client";

import { useIsMutating } from "@tanstack/react-query";

export default function SaveStatus() {
  const status = useIsMutating();

  return status > 0 ? (
    <p className="text-muted-foreground mt-4">Saving...</p>
  ) : (
    <p className="text-muted-foreground mt-4">Saved</p>
  );
}
