import Header from "@/header";
import Image from "next/image";
import Link from "next/link";
import aboutStyles from "~/styles/about.module.css";
import Subtitle from "../_components/about/subtitle";

function KeyScrollTitle() {
  return (
    <div className={`${aboutStyles.scrollTitle} text-7xl`}>
      <p>KEY</p>
      <p>RELIABILITY</p>
      <p>USABILITY</p>
      <p>SECURITY</p>
      <p>EFFICIENCY</p>
    </div>
  );
}

async function Page() {
  return (
    <>
      <Header />
      <div className=" flex h-[70vh] max-h-[600px] w-screen flex-col items-center justify-center overflow-hidden bg-[#E1ECF7]">
        <Image
          src="/ritches-bus-schedule-banner.png"
          alt="Ritche's Bus Schedule"
          className=" w-3/5 max-w-screen-lg"
          width={1200}
          height={630}
        />
      </div>
      <div className=" m-auto flex max-w-screen-lg flex-col gap-3 pb-8">
        <div className=" flex flex-row-reverse gap-8 p-3">
          <div className=" flex flex-1 items-center justify-center p-3">
            <Image
              src="/images/station-stations.gif"
              className=" m-6 aspect-square w-[25vw] max-w-[480px]"
              alt="Waiting for a bus ;-;"
              width={480}
              height={480}
              unoptimized
            />
          </div>
          <div className=" flex-1">
            <div className=" rounded-md">
              <Subtitle>Welcome!</Subtitle>
              <p className=" text-xl">
                Welcome to Ritchie&#39;s Bus Schedule! <br /> This web app is
                dedicated to helping students at Rochester Institute of
                Technology (RIT) navigate the campus bus system more
                efficiently. If you&#39;ve ever found yourself frustrated with
                missing the bus or spending too much time navigating the RIT
                website to find bus schedules, this app is designed for you.
              </p>
            </div>
          </div>
        </div>
        <div className=" my-8 flex h-[60vh] max-h-96 flex-col items-center justify-center">
          <div
            className={` ${aboutStyles.card} rounded-2xl border-2 bg-white p-8 drop-shadow-2xl`}
          >
            <Subtitle>Purpose and Motivation</Subtitle>
            <p className=" text-xl">
              The primary goal of Ritchie&#39;s Bus Schedule is to provide a
              convenient and user-friendly way for students to determine the
              current status of RIT buses based on the time schedule provided by
              RIT. The motivation for this project stemmed from personal
              experience; the frustration of missing the bus in the morning and
              the inefficiency of the existing system inspired the creation of a
              more streamlined solution. With a focus of using the technology
              that just works, the app is designed to be reliable and fast.
            </p>
          </div>
        </div>
      </div>
      <div className=" h-[80vh] max-h-[400px] w-screen overflow-clip pb-10">
        <div className="z-0 h-[200vh] w-[150vw] translate-x-[-30vw] translate-y-60 rotate-12 bg-[#2A609B]">
          <Image
            className={aboutStyles.bus}
            src="/images/bus-moving.png"
            alt="Bus"
            width={2506}
            height={1368}
          ></Image>
        </div>
      </div>
      <div className="z-10 w-screen bg-[#2A609B] text-white">
        <div className=" m-auto mb-[-5rem] max-w-screen-lg translate-y-[-5rem]">
          <Subtitle white>Key Features</Subtitle>
          <div className=" mx-6 flex flex-col gap-4 lg:flex-row">
            <div className=" flex flex-1 flex-col gap-4">
              <div
                className={`${aboutStyles.card} flex flex-1 flex-col gap-2 overflow-hidden rounded-3xl border border-white bg-[#3374BB] drop-shadow-md`}
              >
                <div className=" relative m-auto">
                  <Image
                    src="/images/feature-1.png"
                    alt="Unified Status Page"
                    width={504}
                    height={300}
                  />
                  <div className=" absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-[#3374BBFF] to-[#3374BB00]" />
                </div>
                <div className=" h-24 bg-gradient-to-b from-[#3374BB] to-[#508DCF] p-5 pt-3">
                  <p className=" text-lg font-bold">Unified Status Page</p>
                  <p>
                    View the status of all RIT buses at a glance on a single
                    page.
                  </p>
                </div>
              </div>
              <div
                className={`${aboutStyles.card} flex flex-1 flex-col gap-2 overflow-hidden rounded-3xl border border-white bg-[#3374BB] drop-shadow-md`}
              >
                <div className=" relative m-auto">
                  <Image
                    src="/images/feature-2.png"
                    alt="Unified Status Page"
                    width={504}
                    height={300}
                  />
                  <div className=" absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-[#3374BBFF] to-[#3374BB00]" />
                </div>
                <div className=" h-24 bg-gradient-to-b from-[#3374BB] to-[#508DCF] p-5 pt-3">
                  <p className=" text-lg font-bold">Detailed Bus Pages</p>
                  <p>Access detailed breakdowns of individual bus statuses.</p>
                </div>
              </div>
            </div>
            <div className=" flex flex-1 flex-col gap-4">
              <div
                className={`${aboutStyles.card} ${aboutStyles.cardSlow} flex flex-1 flex-col gap-2 overflow-hidden rounded-3xl border border-white bg-[#3374BB] drop-shadow-md`}
              >
                <div className=" relative m-auto">
                  <Image
                    src="/images/feature-coming.png"
                    alt="Unified Status Page"
                    width={504}
                    height={300}
                  />
                  <div className=" absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-[#3374BBFF] to-[#3374BB00]" />
                </div>
                <div className=" h-24 bg-gradient-to-b from-[#3374BB] to-[#508DCF] p-5 pt-3">
                  <p className=" text-lg font-bold">Stop Page</p>
                  <p>Find out which bus is coming next at a particular stop.</p>
                </div>
              </div>
              <div
                className={`${aboutStyles.card} ${aboutStyles.cardSlow} flex flex-1 flex-col gap-2 overflow-hidden rounded-3xl border border-white bg-[#3374BB] drop-shadow-md`}
              >
                <div className=" relative m-auto">
                  <Image
                    src="/images/feature-coming.png"
                    alt="Unified Status Page"
                    width={504}
                    height={300}
                  />
                  <div className=" absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-[#3374BBFF] to-[#3374BB00]" />
                </div>
                <div className=" h-24 bg-gradient-to-b from-[#3374BB] to-[#508DCF] p-5 pt-3">
                  <p className=" text-lg font-bold">Customization</p>
                  <p>
                    Favorite buses and stops to display on the top of the
                    homepage for quick access.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" mt-12">
            <Subtitle white>Development Journey</Subtitle>
          </div>
          <div className=" flex flex-col gap-6 px-6">
            <p className=" text-lg">
              The project began in December 2023, and since then, it has seen
              significant progress. Initially developed by Hiroto Takeuchi, the
              team has recently expanded to include another developer, Sam Ruan.
            </p>
            <p className=" text-lg">
              Ritchie's Bus Schedule leverages the powerful t3 tech stack, which
              includes Next.js, React, and Tailwind for the frontend, tRPC for
              remote procedure calls, Drizzle ORM for database interactions,
              Vercel for API and hosting, and Supabase as the database. This
              modern stack ensures a robust and scalable application.
            </p>
          </div>
        </div>
        <div className=" mt-6 bg-slate-800">
          <div className=" relative m-auto flex max-w-screen-lg flex-row flex-wrap justify-around gap-6 py-8">
            <div className=" flex min-w-[300px] flex-1 flex-row items-center justify-center rounded-lg">
              <Image
                className=" h-[40px]"
                src="/logo/nextjs.svg"
                alt="next js"
                width={(394 / 80) * 150}
                height={150}
              />
            </div>
            <div className=" flex min-w-[300px] flex-1 flex-row items-center justify-center">
              <Image
                className=" h-[50px]"
                src="/logo/react.svg"
                alt="react js"
                width={150}
                height={150}
              />
            </div>
            <div className=" flex min-w-[300px] flex-1 flex-row items-center justify-center">
              <Image
                className=" h-[50px]"
                src="/logo/tailwindtype.svg"
                alt="tailwind"
                width={(263 / 34) * 150}
                height={150}
              />
            </div>
            <div className=" flex min-w-[300px] flex-1 flex-row items-center justify-center">
              <Image
                className=" h-[50px]"
                src="/logo/supabase.svg"
                alt="supabase"
                width={(581 / 113) * 150}
                height={150}
              />
            </div>
            <div className=" flex min-w-[300px] flex-1 flex-row items-center justify-center pt-[6px]">
              <Image
                className=" h-[50px]"
                src="/logo/drizzle.svg"
                alt="drizzle"
                width={(732 / 80) * 150}
                height={150}
              />
            </div>
            <div className=" flex min-w-[300px] flex-1 flex-row items-center justify-center">
              <Image
                className=" h-[50px]"
                src="/logo/trpc.svg"
                alt="trpc"
                width={(429 / 128) * 150}
                height={150}
              />
            </div>
            <div className=" flex min-w-[300px] flex-1 flex-row items-center justify-center">
              <Image
                className=" h-[45px]"
                src="/logo/vercel.svg"
                alt="vercel"
                width={(4438 / 1000) * 150}
                height={150}
              />
            </div>
          </div>
        </div>
        <div className=" text-blac relative overflow-clip bg-white pt-6 text-black">
          <div className=" relative m-auto max-w-screen-lg px-6 py-8">
            <div>
              <p className=" text-4xl">THE APP'S</p>
              <p className=" text-9xl">SIMPLICITY</p>
              <div className=" flex flex-row gap-8">
                <p className=" ml-24 text-4xl">is</p>
                <KeyScrollTitle />
              </div>
            </div>
            <div className=" ml-24 mt-6 flex flex-col gap-6">
              <p>
                While we could try to show the busses on the map like our
                competitors, we decided to go on a different route. Instead of
                relying on real-time data, the app uses the provided bus times
                table to make educated guesses about bus locations. This
                approach ensures that the app remains functional and reliable,
                even with limited resources, thus reducing downtime. Instead of
                showing on the map the bus locations, we try to highlight the
                most important information, like the time until next stop.
              </p>
              <p>
                User security and privacy are paramount. The app uses Clerk for
                authentication, simplifying the authentication process and
                ensuring user data remains secure. Additionally, the app does
                not track user locations, reducing complexity and enhancing
                privacy.
              </p>
              <p>
                While a final form of feedback system is not yet in place, the
                team is eager to receive feedback from users. As the app is
                released for the public, user input will be invaluable in
                shaping future updates and features. Temporary feedback can be
                provided through the GitHub repository, where users can submit
                issues and feature requests. The team is committed to fostering
                a community-driven development process and welcomes
                contributions from users.
              </p>
            </div>
            <div className=" absolute top-80 z-20">
              <div className=" flex flex-col gap-0">
                <div className=" h-7 w-3 translate-x-4 -rotate-45 bg-white before:block before:h-7 before:w-3 before:translate-x-[8px] before:translate-y-[8px] before:rotate-90 before:bg-white motion-safe:animate-pulse" />
                <div className=" motion-safe:animation-delay-500 h-7 w-3 translate-x-4 -rotate-45 bg-white before:block before:h-7 before:w-3 before:translate-x-[8px] before:translate-y-[8px] before:rotate-90 before:bg-white motion-safe:animate-pulse" />
                <div className=" motion-safe:animation-delay-1000 h-7 w-3 translate-x-4 -rotate-45 bg-white before:block before:h-7 before:w-3 before:translate-x-[8px] before:translate-y-[8px] before:rotate-90 before:bg-white motion-safe:animate-pulse" />
              </div>
              <svg>
                <circle cx="28" cy="28" r="18" fill="white" />
              </svg>
            </div>
            <svg
              className={` ${aboutStyles.pipe} absolute top-52 z-10 translate-x-[-273px]`}
              width="327"
              height="542"
              viewBox="0 0 327 542"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-56.5996 26.0234H248.225C276.943 26.0234 300.225 49.3046 300.225 78.0234V515.18"
                stroke="#21CF33"
                stroke-width="52"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              className=" absolute mt-20 translate-x-[1px]"
              width="920"
              height="635"
              viewBox="0 0 920 635"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.2266 26.1802V389.822C26.2266 418.54 49.5078 441.822 78.2266 441.822H841.448C870.167 441.822 893.448 465.103 893.448 493.822V649.642"
                stroke="#21CF33"
                stroke-width="52"
                stroke-linecap="round"
              />
              <circle cx="28" cy="28" r="18" fill="black" />
            </svg>
            <div className=" relative ml-24 flex h-[57vh] flex-col justify-center gap-2 pt-32">
              <p className=" text-4xl">Try the App!</p>
              <p className=" text-xl">
                Ritchie's Bus Schedule is a testament to the power of innovation
                driven by personal need and community benefit. As the app
                continues to evolve, it promises to make navigating the RIT bus
                system easier and more efficient for all students. We hope you
                find the app as useful and transformative as we do.
              </p>
              <div className=" absolute bottom-2 right-32 flex flex-row items-center gap-4">
                <Link
                  href="/"
                  className=" rounded-bl-full rounded-tr-full bg-red-500 p-4 px-12 text-2xl text-white duration-300 ease-in-out before:absolute before:block before:h-20 before:w-5 before:-translate-x-20 before:-translate-y-6 before:-rotate-[20deg] before:bg-white before:opacity-50 before:duration-500 before:ease-in-out after:absolute after:block after:h-20 after:w-3 after:-translate-x-[6.5rem] after:-translate-y-14 after:-rotate-[20deg] after:bg-white after:opacity-50 after:duration-500 after:ease-in-out hover:scale-105 hover:bg-red-400 hover:before:translate-x-[14.5rem] hover:after:translate-x-52 active:bg-red-600"
                >
                  Use the App &gt;
                </Link>
              </div>
            </div>
          </div>
          <div className=" relative m-auto max-w-screen-lg gap-6 px-6 py-8">
            <div className=" mt-12 pb-12 text-lg font-bold">
              Published 7/31/2024 By Hiroto Takeuchi
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
