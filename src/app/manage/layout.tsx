import Header from "@/header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { api } from "t/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const manager = await api.manager.isManager.query({ userId: userId });
  if (!manager) {
    redirect("/");
  }

  return (
    <main className=" flex min-h-screen w-full flex-col items-center bg-slate-100 text-black">
      <Header />
      {children}
    </main>
  );
}
