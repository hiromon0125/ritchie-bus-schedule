"use client";

import dynamic from "next/dynamic";

export const ProfileBtnComponent = dynamic(() => import("./profileBtn"), {
  ssr: false,
});
