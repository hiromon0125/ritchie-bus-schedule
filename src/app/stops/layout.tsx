import { BackBtn } from "@/backBtn";
import ScrollToTopButton from "@/scrollToTopBtn";
import { IoChevronBackSharp } from "react-icons/io5";
import CopyLink from "../_components/copyLink";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="xs:[--margin:24px] text-foreground flex min-h-screen w-full flex-col items-center gap-3 py-2 [--margin:8px] [--sm-max-w:calc(100%-var(--margin))]">
      <div className="bg-border-background xs:rounded-3xl xs:p-3 flex w-(--sm-max-w) max-w-(--breakpoint-lg) flex-row items-stretch gap-3 rounded-[20px] p-2">
        <BackBtn className="xs:p-2 hover:border-accent bg-item-background border-item-background flex h-auto flex-row items-center gap-2 rounded-2xl border-[3px] p-1">
          <IoChevronBackSharp size={24} />
          <p className="pr-3">Back</p>
        </BackBtn>
        <div className="xs:p-2 bg-item-background border-item-background flex h-auto flex-1 flex-row items-center gap-2 rounded-2xl border-[3px] p-1">
          <h1 className="my-1 ml-2 flex-1 text-left text-2xl font-bold">
            RIT Bus Stops
          </h1>
          <CopyLink link="/stops" />
        </div>
      </div>
      <div className="bg-border-background xs:gap-3 xs:rounded-3xl xs:p-3 flex w-(--sm-max-w) flex-row flex-wrap gap-2 rounded-[20px] p-2 md:max-w-(--breakpoint-lg)">
        {children}
      </div>
      <div className="text-black">
        <ScrollToTopButton />
      </div>
    </main>
  );
}
