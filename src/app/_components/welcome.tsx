"use client";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { FaLink } from "react-icons/fa6";
import { MdOutlineBusAlert } from "react-icons/md";
import { VscGithubInverted } from "react-icons/vsc";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import Coffee from "./buymecoffee";
import ServiceInfoButton, { ServiceInfoContext } from "./serviceinfo";

export default function WelcomePopup() {
  const searchParams = useSearchParams();
  const [state, setState] = useLocalStorage(
    "welcome",
    searchParams.get("bot") == null,
  );
  const { state: isServiceInfoOpen } = useContext(ServiceInfoContext);
  const isWelcomeOpen = state && !isServiceInfoOpen; // to prevent both popups from showing at the same time
  return (
    <Dialog open={isWelcomeOpen} onOpenChange={setState}>
      <DialogContent className="bg-item-background rounded-3xl border-4 border-blue-500">
        <div>
          <div className="relative flex h-[200px] w-full flex-col items-center bg-[rgba(225,236,247,100)]">
            <Image
              className="h-[200px] object-contain"
              src="/ritches-bus-schedule-banner.png"
              alt="banner"
              height={1201}
              width={630}
              loading="eager"
            />
          </div>
          <div className="h-3 w-full bg-linear-to-b from-[#e1ecf7] to-[#e1ecf700]" />
        </div>
        <div className="flex flex-col gap-4 p-4 pt-0 pb-3">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Welcome!</DialogTitle>
            <DialogDescription className="pb-4 text-base">
              Richie’s Bus Schedule is a seemless tool for quickly finding the
              next bus arrival, keeping you focused on school.
            </DialogDescription>
            <div className="flex flex-col gap-2">
              <DialogClose asChild>
                <Button className="bg-accent shadow-accent text-base text-white shadow-md hover:bg-blue-500 hover:text-white hover:opacity-90">
                  Let’s go!
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <SignedOut>
                  <SignInButton>
                    <div className="w-full rounded-md border-2 border-blue-500 p-1 text-center text-base text-blue-500 transition-all hover:shadow-lg hover:shadow-blue-100">
                      Create an account
                    </div>
                  </SignInButton>
                </SignedOut>
              </DialogClose>
            </div>
          </DialogHeader>
          <DialogFooter>
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full flex-row items-center gap-2 opacity-70">
                <div className="flex-auto rounded-full border border-black" />
                <div className="flex flex-row gap-2">
                  <FaLink />
                  <p className="font-semibold">Links</p>
                </div>
                <div className="flex-auto rounded-full border border-black" />
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div className="left flex flex-row gap-2">
                  <ServiceInfoButton className="flex max-h-8 flex-row items-center gap-2 rounded-lg border-2 border-blue-500 p-2 text-xs text-blue-500 hover:bg-blue-500 hover:text-white">
                    <MdOutlineBusAlert className="scale-150" />
                    Service Alert
                  </ServiceInfoButton>
                  <Button
                    variant={"outline"}
                    size="sm"
                    className="aspect-square rounded-lg border-2 border-black p-0 font-mono text-lg text-black hover:bg-black hover:text-white"
                    asChild
                  >
                    <Link href="/about">i</Link>
                  </Button>
                  <Button
                    variant={"outline"}
                    size="sm"
                    className="aspect-square rounded-lg border-2 border-black p-0 font-mono text-lg text-black hover:bg-black hover:text-white"
                  >
                    <a href="https://github.com/hiromon0125/ritchie-bus-schedule">
                      <VscGithubInverted className="scale-125" />
                    </a>
                  </Button>
                </div>
                <div className="right flex flex-row gap-2">
                  <Coffee size="small" />
                </div>
              </div>
              <div className="flex flex-row items-center justify-between text-gray-600">
                <p className="text-xs">© 2025 Open Source on Github</p>
                <p className="text-xs">
                  Designed & Developed by{" "}
                  <a href="https://github.com/hiromon0125">Hiro</a>
                </p>
              </div>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
