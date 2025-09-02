"use client";

import { useActionState, useEffect, useRef } from "react";
import { flushAllCache } from "./manageAction";

export function FlushCacheBtn() {
  const mounted = useRef(false);
  const [count, formAction, isPending] = useActionState(flushAllCache, 0);
  useEffect(() => {
    if (!mounted.current || isPending) {
      mounted.current = true;
      return;
    }
    if (count != 0) alert(`Flushed ${count} cache entries`);
  }, [isPending, count]);
  return (
    <form action={formAction}>
      <button
        type="submit"
        className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
        disabled={isPending}
      >
        Flush All Cache
      </button>
    </form>
  );
}

export default function FlushCache() {
  return (
    <div>
      <p>Flush All Cache</p>
      <FlushCacheBtn />
    </div>
  );
}
