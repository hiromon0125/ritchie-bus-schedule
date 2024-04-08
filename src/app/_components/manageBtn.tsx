"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { api } from "../../trpc/react";

function ManageButton() {
  const router = useRouter();
  const { user } = useUser();
  console.log(`userId: ${user?.id}`);

  const { data } = api.manager.isManager.useQuery({ userId: user?.id ?? "" });
  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <button
        className="rounded-lg border-2 border-black bg-black px-4 py-2 text-lg font-semibold text-white"
        onClick={() => router.push("/manage")}
      >
        Manage
      </button>
    </div>
  );
}

export default ManageButton;
