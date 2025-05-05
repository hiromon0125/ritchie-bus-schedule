import Image from "next/image";
import Link from "next/link";
import { HiMiniHome } from "react-icons/hi2";
import { TiArrowBack } from "react-icons/ti";
import { version } from "../../package.json";
import { Button } from "../components/ui/button";
import { BackBtn } from "./_components/backBtn";
export default function NotFound() {
  return (
    <main className="text-foreground xs:[--margin:24px] flex min-h-screen w-full flex-col items-center gap-3 py-2 [--margin:8px] [--sm-max-w:calc(100%-var(--margin))]">
      <div className="bg-border-background xs:gap-3 xs:rounded-3xl xs:p-3 flex w-(--sm-max-w) flex-col gap-2 rounded-[20px] p-2 md:max-w-(--breakpoint-lg)">
        <div className="bg-item-background rounded-xl p-3">
          <div className="flex flex-row items-center">
            <Image
              src="/images/big-sad-bus.png"
              alt="Sad Bus"
              width={160}
              height={160}
            />
            <div className="flex flex-col gap-2">
              <h2 className="xs:text-5xl m-0 text-xl font-bold">
                404 Not Found
              </h2>
              <p className="text-xl font-bold">
                Sorry, the page you are looking for does not exist...
              </p>
            </div>
          </div>
          <div className="flex flex-row items-end justify-between">
            <div className="flex flex-row items-center gap-3">
              <Button className="bg-accent" asChild>
                <Link href="/">
                  <HiMiniHome />
                  Home
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-primary border-2"
                asChild
              >
                <BackBtn>
                  <TiArrowBack size={32} className="scale-125" />
                  Back
                </BackBtn>
              </Button>
            </div>
            <div className="flex flex-col items-end">
              <p className="px-4 text-sm">Version: {version}</p>
              <Button variant="link" asChild>
                <Link
                  href={
                    "https://github.com/hiromon0125/ritchie-bus-schedule/issues"
                  }
                >
                  Report a broken link...
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
