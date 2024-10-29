"use client";

import { UserProfile } from "@clerk/nextjs";
import { GoCodeReview } from "react-icons/go";
import { VscLaw } from "react-icons/vsc";

export default function Settings() {
  return (
    <UserProfile>
      <UserProfile.Link
        label="About"
        url="/about"
        labelIcon={<GoCodeReview size={16} />}
      />
      <UserProfile.Link
        label="Terms"
        labelIcon={<VscLaw size={16} />}
        url="/pp"
      />
    </UserProfile>
  );
}
