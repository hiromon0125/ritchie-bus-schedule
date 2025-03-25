import { BackBtn } from "@/backBtn";
import ScrollToTopButton from "@/scrollToTopBtn";
import { IoChevronBackSharp } from "react-icons/io5";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="xs:[--margin:24px] text-foreground flex min-h-screen w-full flex-col items-center gap-3 py-2 [--margin:8px] [--sm-max-w:calc(100%-var(--margin))]">
      <div className="w-(--sm-max-w) max-w-(--breakpoint-lg) px-3">
        <BackBtn className="xs:p-2 hover:border-accent bg-item-background border-item-background flex flex-row items-center gap-2 rounded-2xl border-[3px] p-1">
          <IoChevronBackSharp size={24} />
          <p className="pr-3">Back</p>
        </BackBtn>
      </div>
      <div className="bg-border-background xs:gap-3 xs:rounded-3xl xs:p-3 flex w-(--sm-max-w) max-w-(--breakpoint-lg) flex-row flex-wrap gap-2 rounded-[20px] p-2">
        {children}
      </div>
      <div className="text-black">
        <ScrollToTopButton />
      </div>
    </main>
  );
}
