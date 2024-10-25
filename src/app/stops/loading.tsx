import { BackBtn } from "@/backBtn";
import Header from "@/header";
import { StopListSkeleton } from "@/navlist/stopNavList";
import ScrollToTopButton from "@/scrollToTopBtn";
import { Suspense } from "react";
import { IoChevronBackSharp } from "react-icons/io5";

export default async function Page() {
  return (
    <div className=" bg-slate-700">
      <Header title="Stops" route="stop" titleColor="white" />
      <div className=" px-5">
        <div>
          <Suspense fallback={<button>Back</button>}>
            <BackBtn className=" m-2 flex flex-row items-center gap-2 bg-transparent p-2 text-white">
              <IoChevronBackSharp size={24} />
              <p>Back</p>
            </BackBtn>
          </Suspense>
        </div>
        <StopListSkeleton />
      </div>
      <Suspense>
        <ScrollToTopButton />
      </Suspense>
    </div>
  );
}
