import Image from "next/image";
import Link from "next/link";
import { HiMiniHome } from "react-icons/hi2";
import { TiArrowBack } from "react-icons/ti";
import { APPCONFIG } from "../../appconfig";
import { Button } from "../../components/ui/button";
import { BackBtn } from "./backBtn";

export function ErrorPage({
  statusCode,
  statusMeaning,
  statusMessage,
}: {
  statusCode: number;
  statusMeaning: string;
  statusMessage: string;
}) {
  return (
    <main className="text-foreground xs:[--margin:24px] flex min-h-screen w-full flex-col items-center gap-3 py-2 [--margin:8px] [--sm-max-w:calc(100%-var(--margin))]">
      <div className="bg-border-background xs:gap-3 xs:rounded-3xl xs:p-3 flex w-(--sm-max-w) flex-col gap-2 rounded-[20px] p-2 md:max-w-(--breakpoint-lg)">
        <div className="bg-item-background flex flex-col gap-3 rounded-xl p-3">
          <div className="flex flex-col items-center not-md:pb-2 sm:flex-row">
            <Image
              src="/images/big-sad-bus.png"
              alt="Sad Bus"
              width={160}
              height={160}
              title="Sad Bus"
              loading="eager"
            />
            <div className="flex flex-col gap-2">
              <h1 className="xs:text-2xl m-0 text-xl font-bold md:text-5xl">
                {statusCode} {statusMeaning}
              </h1>
              <p className="text-base font-bold md:text-xl">{statusMessage}</p>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between gap-4 sm:flex-row">
            <div className="flex w-full flex-col items-center gap-3 sm:flex-row">
              <Button className="bg-accent not-sm:w-full" asChild>
                <Link href="/">
                  <HiMiniHome />
                  Home
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-primary border-2 not-sm:w-full"
                asChild
              >
                <BackBtn>
                  <TiArrowBack size={32} className="scale-125" />
                  Back
                </BackBtn>
              </Button>
            </div>
            <div className="flex flex-col items-end">
              <p className="px-4 text-sm">Version: {APPCONFIG.VERSION}</p>
              <Button variant="link" asChild>
                <Link href={APPCONFIG.GITHUB_ISSUE}>Report a problem...</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
