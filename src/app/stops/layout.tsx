import { Suspense } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { BackBtn } from "../_components/backBtn";
import Header from "../_components/header";
import ScrollToTopButton from "../_components/scrollToTopBtn";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex flex-col items-center bg-slate-100">
      <Header title="Stops" route="stop" />
      <div className=" w-full max-w-screen-lg px-5 text-zinc-900">
        <div>
          <Suspense fallback={<button>Back</button>}>
            <BackBtn className=" m-2 flex flex-row items-center gap-2 bg-transparent p-2 ">
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
