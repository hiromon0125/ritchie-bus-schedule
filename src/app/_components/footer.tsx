import Image from "next/image";
import Link from "next/link";
import Coffee from "./buymecoffee";
import ServiceInfoButton from "./serviceinfo";
import { Share } from "./share";
function Footer() {
  return (
    <div className=" w-full bg-slate-800 pb-24 text-start text-base text-white md:pb-0">
      <div className=" m-auto flex w-full max-w-screen-lg flex-col">
        <div className=" flex flex-col justify-between gap-3 px-3 pt-3 sm:px-6 sm:pt-6 md:flex-row md:items-end md:gap-8">
          <div className=" flex flex-row items-center md:gap-2 md:pb-6">
            <Image
              src="/icons/bus-512x512.png"
              alt="Logo"
              width={60}
              height={60}
              className=" scale-75 md:scale-100"
            />
            <h2 className=" text-lg text-slate-200 md:text-2xl">
              Ritchie's Bus Schedule
            </h2>
          </div>
          <p className=" text-sm sm:text-base md:hidden">
            A seemless tool for quickly finding the next bus arrival, keeping
            you focused on school.
          </p>
          <p className=" text-xs text-slate-300 sm:text-sm md:hidden">
            Designed & Developed by{" "}
            <a className=" underline" href="https://github.com/hiromon0125">
              Hiroto Takeuchi
            </a>
          </p>
          <div className=" group">
            <Image
              className=" translate-x-0 transition-all duration-500 group-hover:translate-x-36 group-hover:opacity-0"
              src="/images/speedy-bus.png"
              alt="speedy bus"
              width={84}
              height={32}
            />
          </div>
        </div>
        <div className=" flex flex-row gap-6 border-t-2 border-t-white p-3 sm:p-6">
          <div className=" hidden w-24 flex-auto flex-col justify-between md:visible md:flex">
            <p className=" text-lg">
              A seemless tool for quickly finding the next bus arrival, keeping
              you focused on school.
            </p>
            <p className=" text-sm text-slate-300">
              Designed & Developed by{" "}
              <a className=" underline" href="https://github.com/hiromon0125">
                Hiroto Takeuchi
              </a>
              <br />
              Open source assisted by{" "}
              <a href="https://fossrit.github.io/" className=" underline">
                FOSSRIT
              </a>
            </p>
          </div>
          <div className=" flex w-48 flex-auto flex-row gap-3 sm:gap-8 md:justify-end">
            <div className=" flex flex-col gap-3">
              <p>Navigate</p>
              <Link className=" text-slate-300" href="/">
                Home
              </Link>
              <Link className=" text-slate-300" href="/buses">
                Buses
              </Link>
              <Link className=" text-slate-300" href="/stops">
                Stops
              </Link>
              <ServiceInfoButton className=" text-left text-slate-300">
                Service Alert
              </ServiceInfoButton>
            </div>
            <div className=" flex flex-col gap-3">
              <p>Project</p>
              <Link className=" text-slate-300" href="/about">
                About
              </Link>
              <a
                className=" text-slate-300"
                href="https://github.com/hiromon0125/ritchie-bus-schedule"
              >
                Repository
              </a>
              <a
                className=" text-slate-300"
                href="https://github.com/hiromon0125/ritchie-bus-schedule/issues"
              >
                Report Issues
              </a>
            </div>
            <div className=" flex flex-col gap-3">
              <p>Legal</p>
              <Link className=" text-slate-300" href="/setting">
                Settings
              </Link>
              <Link className=" text-slate-300" href="/pp">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
        <div className=" flex flex-col-reverse items-start justify-between gap-2 border-t-2 border-t-white px-3 py-3 text-slate-300 sm:px-6 md:flex-row md:items-center">
          <p className=" text-sm ">© 2025 Open Source on GitHub</p>
          <div className=" flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <div className=" flex flex-row items-center gap-4">
              <p className=" hidden text-lg md:flex">Share</p>
              <Share />
            </div>
            <div className=" flex flex-row items-center gap-4">
              <p className=" hidden text-lg md:flex">Donate</p>
              <Coffee size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
