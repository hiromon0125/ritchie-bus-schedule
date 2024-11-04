import Header from "@/header";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" flex min-h-screen w-full flex-col items-center bg-slate-100 text-black">
      <Header />
      {children}
    </main>
  );
}
