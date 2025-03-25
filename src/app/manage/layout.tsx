import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" flex min-h-screen w-full flex-col items-center text-black">
      {children}
    </main>
  );
}
