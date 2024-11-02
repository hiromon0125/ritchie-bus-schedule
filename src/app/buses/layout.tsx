import { BackBtn } from "@/backBtn";
import Header from "@/header";
import ScrollToTopButton from "@/scrollToTopBtn";
import { Suspense } from "react";
import { IoChevronBackSharp } from "react-icons/io5";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex flex-col items-center bg-slate-100">
      <Header title="Buses" route="bus" />
      <div className=" w-full max-w-screen-lg px-5">
        <div className=" w-full">
          <Suspense
            fallback={
              <button>
                <IoChevronBackSharp size={24} />
                Back
              </button>
            }
          >
            <BackBtn className=" m-2 flex flex-row items-center gap-2 bg-transparent p-2">
              <IoChevronBackSharp size={24} />
              <p>Back</p>
            </BackBtn>
          </Suspense>
        </div>
        {children}
      </div>
      <ScrollToTopButton />
    </div>
  );
}
