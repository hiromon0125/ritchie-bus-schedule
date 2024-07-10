import Header from "@/header";
import Image from "next/image";
import aboutStyles from "~/styles/about.module.css";
import Subtitle from "../_components/about/subtitle";

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
            <div className=" rounded-md ">
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
          <div className=" rounded-2xl border-2 bg-white p-8 drop-shadow-2xl">
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
        <div className=" m-auto max-w-screen-lg translate-y-[-5rem]">
          <Subtitle white>Key Features</Subtitle>
          <div className=" mx-6 flex flex-col gap-4 lg:flex-row">
            <div className=" flex flex-1 flex-col gap-4">
              <div className=" flex flex-1 flex-col gap-2 overflow-hidden rounded-3xl border border-white bg-[#3374BB] drop-shadow-md">
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
              <div className=" flex flex-1 flex-col gap-2 overflow-hidden rounded-3xl border border-white bg-[#3374BB] drop-shadow-md">
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
              <div className=" flex flex-1 flex-col gap-2 overflow-hidden rounded-3xl border border-white bg-[#3374BB] drop-shadow-md">
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
              <div className=" flex flex-1 flex-col gap-2 overflow-hidden rounded-3xl border border-white bg-[#3374BB] drop-shadow-md">
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
          <ul></ul>
          <p className=" mt-4 text-lg">
            <strong>Development Journey</strong>
          </p>
          <p>
            The project began in December 2023, and since then, it has seen
            significant progress. Initially developed by Hiroto Takeuchi, the
            team has recently expanded to include another developer, Sam Ruan.
            Hiroto leads the project and maintains the app, while Sam
            contributes to the development of new features.
          </p>
          <p className=" mt-4 text-lg">
            <strong>Technologies Used</strong>
          </p>
          <p>
            Ritchie&#39;s Bus Schedule leverages the powerful t3 tech stack,
            which includes Next.js, React, and Tailwind for the frontend, tRPC
            for remote procedure calls, Drizzle ORM for database interactions,
            Vercel for API and hosting, and Supabase as the database. This
            modern stack ensures a robust and scalable application.
          </p>
          <p className=" mt-4 text-lg">
            <strong>Challenges and Solutions</strong>
          </p>
          <p>
            The development process was not without its challenges. The steep
            learning curve associated with the new technologies required
            extensive consultation of documentation. Additionally, a recent
            change in database subscription fees necessitated a migration, which
            temporarily set back development. However, through diligent effort
            and a commitment to overcoming obstacles, the team has made
            significant progress.
          </p>
          <p className=" mt-4 text-lg">
            <strong>Unique Aspects</strong>
          </p>
          <p>
            One unique aspect of Ritchie&#39;s Bus Schedule is its approach to
            bus status tracking. Instead of relying on real-time data, the app
            uses the provided bus schedules to make educated guesses about bus
            locations. This approach ensures that the app remains functional and
            reliable, even with limited resources.
          </p>
          <p className=" mt-4 text-lg">
            <strong>Future Plans</strong>
          </p>
          <p>
            Looking ahead, the team plans to expand the app to include more
            buses and implement a rating system for buses based on their
            reliability. These features aim to further improve the user
            experience and provide more accurate information about the bus
            system.
          </p>
          <p className=" mt-4 text-lg">
            <strong>Security and Privacy</strong>
          </p>
          <p>
            User security and privacy are paramount. The app uses{" "}
            <a href="https://clerk.com/">Clerk</a> for authentication,
            simplifying the authentication process and ensuring user data
            remains secure. Additionally, the app does not track user locations,
            reducing complexity and enhancing privacy.
          </p>
          <p className=" mt-4 text-lg">
            <strong>User Feedback and Community</strong>
          </p>
          <p>
            While a final form of feedback system is not yet in place, the team
            is eager to receive feedback from users. As the app is released for
            the public, user input will be invaluable in shaping future updates
            and features.
          </p>
          <p>
            Temporary feedback can be provided through the{" "}
            <a href="https://github.com/hiromon0125/ritchie-bus-schedule/issues">
              GitHub repository
            </a>
            , where users can submit issues and feature requests. The team is
            committed to fostering a community-driven development process and
            welcomes contributions from users.
          </p>
          <p className=" mt-4 text-lg">
            <strong>Conclusion</strong>
          </p>
          <p>
            Ritchie&#39;s Bus Schedule is a testament to the power of innovation
            driven by personal need and community benefit. As the app continues
            to evolve, it promises to make navigating the RIT bus system easier
            and more efficient for all students. Thank you for visiting, and we
            hope you find the app as useful and transformative as we do.
          </p>
        </div>
      </div>
    </>
  );
}

export default Page;
