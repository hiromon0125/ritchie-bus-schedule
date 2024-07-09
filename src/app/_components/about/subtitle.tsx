import Image from "next/image";
import iconStyles from "~/styles/animated-icon.module.css";

export default function TitleP({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex flex-row gap-3">
      <Image
        src="/icons/Moving-icon.png"
        alt={"Moving Bus"}
        width={96}
        height={96}
        priority
        className={iconStyles.moving}
      />
      <h2
        id="about-ritchie-s-bus-schedule"
        className=" mt-8 text-3xl font-bold"
      >
        {children}
      </h2>
    </div>
  );
}
