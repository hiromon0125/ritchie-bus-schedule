"use client";
import { UserButton } from "@clerk/nextjs";
import { FaRegStar } from "react-icons/fa6";
import { GoCodeReview } from "react-icons/go";
import { HiHome } from "react-icons/hi2";
import { MdDirectionsBus } from "react-icons/md";
import { TbRoute } from "react-icons/tb";

export default function ProfileButton() {
  return (
    <UserButton userProfileMode="navigation" userProfileUrl="/user-profile">
      <UserButton.MenuItems>
        <UserButton.Link
          href="/"
          label="Home"
          labelIcon={<HiHome size={16} />}
        />
        <UserButton.Link
          href="/buses"
          label="Bus List"
          labelIcon={<MdDirectionsBus size={16} />}
        />
        <UserButton.Link
          href="/stops"
          label="Stop List"
          labelIcon={<TbRoute size={16} />}
        />
        <UserButton.Link
          href="/about"
          label="About"
          labelIcon={<GoCodeReview size={16} />}
        />
        <UserButton.Link
          href="https://forms.gle/7ooRfsDzmKvHnnZ76"
          label="Rate Us!"
          labelIcon={<FaRegStar size={16} />}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
