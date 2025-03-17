import { BackBtn } from "@/backBtn";
import ScrollToTopButton from "@/scrollToTopBtn";
import { Suspense } from "react";
import { IoChevronBackSharp } from "react-icons/io5";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex flex-col items-center">
      <div className=" w-full max-w-screen-lg px-2 text-zinc-900 xs:px-5">
        <div>
          <Suspense fallback={<button>Back</button>}>
            <BackBtn className=" m-2 flex flex-row items-center gap-2 bg-transparent p-1 xs:p-2 ">
              <IoChevronBackSharp size={24} />
              <p>Back</p>
            </BackBtn>
          </Suspense>
        </div>
        {children}
        <ScrollToTopButton />
      </div>
    </div>
  );
}
