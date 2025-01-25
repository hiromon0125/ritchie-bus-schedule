import Coffee from "@/buymecoffee";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Share } from "./share";

function Footer() {
  return (
    <div className="w-full bg-slate-800">
      <div className="m-auto flex w-full max-w-screen-lg flex-col justify-between pb-20 lg:flex-row lg:gap-0">
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-row items-center gap-2">
            <Image
              src="/icons/bus-512x512.png"
              alt="Logo"
              width={36}
              height={36}
            />
            <h2 className="text-3xl text-slate-200">Ritchie's Bus Schedule</h2>
          </div>
          <p className="text-slate-200">
            This is a project made by{" "}
            <a
              className="text-slate-200 underline"
              href="https://github.com/hiromon0125"
            >
              Hiroto Takeuchi
            </a>{" "}
            and{" "}
            <a
              className="text-slate-200 underline"
              href="https://github.com/0SMA0"
            >
              Sam Ruan
            </a>
            .<br />
            <br />
          </p>
          <Coffee />
        </div>
        <div className="flex-1 lg:pl-16">
          <div className="flex flex-col gap-5 p-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl text-slate-200">Links</h2>
              <div className="flex flex-row flex-wrap gap-4">
                <Link className="text-slate-200 underline" href="/">
                  Home
                </Link>
                <Link className="text-slate-200 underline" href="/about">
                  About
                </Link>
                <Link className="text-slate-200 underline" href="/buses">
                  Buses
                </Link>
                <Link className="text-slate-200 underline" href="/stops">
                  Stops
                </Link>
                <Link
                  className="text-slate-200 underline"
                  href="https://github.com/hiromon0125/ritchies-bus-schedule"
                >
                  GitHub
                </Link>
                <SignedOut>
                  <SignInButton>
                    <p className="text-slate-200 underline drop-shadow-md">
                      Sign In
                    </p>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link className="text-slate-200 underline" href="/setting">
                    Settings
                  </Link>
                </SignedIn>
                <Link className="text-slate-200 underline" href="/pp">
                  Privacy Policy
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl text-slate-200">Share</h2>
              <Share />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
