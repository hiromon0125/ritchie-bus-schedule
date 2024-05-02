"use client";

import { useIsMutating } from "@tanstack/react-query";

export default function SaveStatus() {
  const status = useIsMutating();

  return status > 0 ? (
    <p className=" mt-4 text-gray-600">Saving...</p>
  ) : (
    <p className=" mt-4 text-gray-600">Saved</p>
  );
}
