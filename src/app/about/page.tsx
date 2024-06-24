import Header from "@/header";
import Image from "next/image";
import iconStyles from "~/styles/animated-icon.module.css";

async function Page() {
  return (
    <>
      <Header />
      <div className=" m-auto flex max-w-screen-lg flex-col gap-3 pb-8">
        <div className=" flex flex-row gap-3">
          <Image
            src="/icons/Moving-icon.png"
            alt={"Moving Bus"}
            width={96}
            height={96}
            priority
            className={iconStyles.moving}
          />
          <h2 id="about-ritchie-s-bus-schedule" className=" mt-8 text-3xl">
            About Ritchie&#39;s Bus Schedule
          </h2>
        </div>
        <p className=" text-lg">
          <strong>Introduction</strong>
        </p>
        <p>
          Welcome to Ritchie&#39;s Bus Schedule! This web app is dedicated to
          helping students at Rochester Institute of Technology (RIT) navigate
          the campus bus system more efficiently. If you&#39;ve ever found
          yourself frustrated with missing the bus or spending too much time
          navigating the RIT website to find bus schedules, this app is designed
          for you.
        </p>
        <p className=" mt-4 text-lg">
          <strong>Purpose and Motivation</strong>
        </p>
        <p>
          The primary goal of Ritchie&#39;s Bus Schedule is to provide a
          convenient and user-friendly way for students to determine the current
          status of RIT buses based on the time schedule provided by RIT. The
          motivation for this project stemmed from personal experience; the
          frustration of missing the bus in the morning and the inefficiency of
          the existing system inspired the creation of a more streamlined
          solution.
        </p>
        <p className=" mt-4 text-lg">
          <strong>Key Features</strong>
        </p>
        <p>
          Ritchie&#39;s Bus Schedule offers a range of features to enhance your
          bus-riding experience:
        </p>
        <ul>
          <li>
            <strong>Unified Status Page:</strong> View the status of all RIT
            buses at a glance on a single page.
          </li>
          <li>
            <strong>Detailed Bus Pages:</strong> Access detailed breakdowns of
            individual bus statuses.
          </li>
          <li>
            <strong>Stop Page:</strong> Find out which bus is coming next at a
            particular stop.
          </li>
          <li>
            <strong>Customization:</strong> Plans to allow users to customize
            their favorite buses and stops, displaying them prominently on the
            homepage for quick access.
          </li>
        </ul>
        <p className=" mt-4 text-lg">
          <strong>Development Journey</strong>
        </p>
        <p>
          The project began in December 2023, and since then, it has seen
          significant progress. Initially developed by Hiroto Takeuchi, the team
          has recently expanded to include another developer, Sam Ruan. Hiroto
          leads the project and maintains the app, while Sam contributes to the
          development of new features.
        </p>
        <p className=" mt-4 text-lg">
          <strong>Technologies Used</strong>
        </p>
        <p>
          Ritchie&#39;s Bus Schedule leverages the powerful t3 tech stack, which
          includes Next.js, React, and Tailwind for the frontend, tRPC for
          remote procedure calls, Drizzle ORM for database interactions, Vercel
          for API and hosting, and Supabase as the database. This modern stack
          ensures a robust and scalable application.
        </p>
        <p className=" mt-4 text-lg">
          <strong>Challenges and Solutions</strong>
        </p>
        <p>
          The development process was not without its challenges. The steep
          learning curve associated with the new technologies required extensive
          consultation of documentation. Additionally, a recent change in
          database subscription fees necessitated a migration, which temporarily
          set back development. However, through diligent effort and a
          commitment to overcoming obstacles, the team has made significant
          progress.
        </p>
        <p className=" mt-4 text-lg">
          <strong>Unique Aspects</strong>
        </p>
        <p>
          One unique aspect of Ritchie&#39;s Bus Schedule is its approach to bus
          status tracking. Instead of relying on real-time data, the app uses
          the provided bus schedules to make educated guesses about bus
          locations. This approach ensures that the app remains functional and
          reliable, even with limited resources.
        </p>
        <p className=" mt-4 text-lg">
          <strong>Future Plans</strong>
        </p>
        <p>
          Looking ahead, the team plans to expand the app to include more buses
          and implement a rating system for buses based on their reliability.
          These features aim to further improve the user experience and provide
          more accurate information about the bus system.
        </p>
        <p className=" mt-4 text-lg">
          <strong>Security and Privacy</strong>
        </p>
        <p>
          User security and privacy are paramount. The app uses{" "}
          <a href="https://clerk.com/">Clerk</a> for authentication, simplifying
          the authentication process and ensuring user data remains secure.
          Additionally, the app does not track user locations, reducing
          complexity and enhancing privacy.
        </p>
        <p className=" mt-4 text-lg">
          <strong>User Feedback and Community</strong>
        </p>
        <p>
          While a final form of feedback system is not yet in place, the team is
          eager to receive feedback from users. As the app is released for the
          public, user input will be invaluable in shaping future updates and
          features.
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
          driven by personal need and community benefit. As the app continues to
          evolve, it promises to make navigating the RIT bus system easier and
          more efficient for all students. Thank you for visiting, and we hope
          you find the app as useful and transformative as we do.
        </p>
      </div>
    </>
  );
}

export default Page;
