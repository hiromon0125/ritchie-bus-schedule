"use server";
import { Suspense } from "react";
import { LuClockAlert } from "react-icons/lu";
import { api } from "t/server";
import ServiceInfoButton from "./serviceinfo";

async function AlertNavigation() {
  const count = await api.serviceinfo.getCount();
  return (
    <ServiceInfoButton className="bg-item-background hover:border-accent border-item-background flex h-full flex-row items-center justify-center gap-1 rounded-lg border-[3px] px-3 transition-all not-dark:shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] hover:shadow-md">
      <LuClockAlert size={24} color="black" className="dark:invert-100" />
      <div className="relative">
        <p>Alert</p>
        {count > 0 && (
          <div className="absolute top-[-5px] right-[-8px] flex aspect-square h-4 flex-row items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
            <p>{count}</p>
          </div>
        )}
      </div>
    </ServiceInfoButton>
  );
}

export async function AlertNavBtn() {
  return (
    <Suspense
      fallback={
        <ServiceInfoButton className="bg-item-background hover:border-accent border-item-background flex h-full flex-row items-center justify-center gap-1 rounded-lg border-[3px] px-3 transition-all not-dark:shadow-[0_4px_4px_0_var(--black-shadow-color),0_-1px_2px_0_var(--white-shadow-color)] hover:shadow-md">
          <LuClockAlert size={24} color="black" className="dark:invert-100" />
          <p>Alert</p>
        </ServiceInfoButton>
      }
    >
      <AlertNavigation />
    </Suspense>
  );
}
