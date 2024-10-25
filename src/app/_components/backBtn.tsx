"use client";

import { useRouter } from "next/navigation";

export function BackBtn({
  children,
  ...props
}: React.ComponentProps<"button">) {
  const router = useRouter();

  return (
    <button
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        router.back();
      }}
    >
      {children}
    </button>
  );
}
