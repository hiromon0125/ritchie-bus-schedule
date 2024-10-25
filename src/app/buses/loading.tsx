import { Suspense } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { BackBtn } from "../_components/backBtn";
import Header from "../_components/header";
import ScrollToTopButton from "../_components/scrollToTopBtn";
import { BusListSkeleton } from "./page";

export default async function Page() {
  return (
    <div className=" bg-slate-700">
      <Header title="Buses" route="bus" titleColor="white" />
      <div className=" px-5">
        <div>
          <Suspense fallback={<button>Back</button>}>
            <BackBtn className=" m-2 flex flex-row items-center gap-2 bg-transparent p-2 text-white">
              <IoChevronBackSharp size={24} />
              <p>Back</p>
            </BackBtn>
          </Suspense>
        </div>
        <BusListSkeleton />
      </div>
      <ScrollToTopButton />
    </div>
  );
}
