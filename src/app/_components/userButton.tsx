"use client";
import { UserButton } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GoCodeReview } from "react-icons/go";
import { HiHome } from "react-icons/hi2";
import {
  MdDirectionsBus,
  MdOutlineBusAlert,
  MdOutlineLightMode,
  MdOutlineNightlight,
} from "react-icons/md";
import { TbRoute } from "react-icons/tb";
import { cn } from "../../lib/utils";
import { api } from "../../trpc/react";
import { ServiceInfoContext } from "./serviceinfo";

const USER_BUTTON_APPEARANCE: Parameters<typeof UserButton>[0]["appearance"] = {
  elements: {
    userButtonAvatarBox: {
      height: "2.5rem",
      width: "2.5rem",
    },
  },
} as const;

export default function ProfileButton() {
  const router = useRouter();
  const { setState: openServiceInfo } = useContext(ServiceInfoContext);
  const { data: serviceInfoCount } = api.serviceinfo.getCount.useQuery();
  return (
    <UserButton
      userProfileMode="navigation"
      userProfileUrl="/user-profile"
      appearance={USER_BUTTON_APPEARANCE}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          href="/"
          label="Home"
          labelIcon={<HiHome size={16} />}
        />
        <UserButton.Action
          onClick={() => openServiceInfo(true)}
          label="Service Alert"
          labelIcon={
            <div
              className={cn(
                "flex flex-row items-center justify-center",
                serviceInfoCount &&
                  "m-[-4px] h-6 rounded-full border bg-red-500 text-white",
              )}
            >
              <MdOutlineBusAlert className="scale-125" />
            </div>
          }
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
        <UserButton.Action
          label="Appearance"
          labelIcon={
            Cookies.get("theme") === "dark" ? (
              <MdOutlineNightlight />
            ) : (
              <MdOutlineLightMode />
            )
          }
          onClick={() => {
            if (Cookies.get("theme") === "light") {
              Cookies.set("theme", "dark", { expires: new Date(2038, 0, 19) });
            } else {
              Cookies.set("theme", "light", { expires: new Date(2038, 0, 19) });
            }
            router.refresh();
          }}
        />
        {/* TODO: change to the official report link when implemented
        <UserButton.Link
          href="https://forms.gle/7ooRfsDzmKvHnnZ76"
          label="Rate Us!"
          labelIcon={<FaRegStar size={16} />}
        /> */}
      </UserButton.MenuItems>
    </UserButton>
  );
}
