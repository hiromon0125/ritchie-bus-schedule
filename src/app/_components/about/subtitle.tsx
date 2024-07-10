import Image from "next/image";
import iconStyles from "~/styles/animated-icon.module.css";

export default function Subtitle({
  children,
  white = false,
}: {
  children: React.ReactNode;
  white?: boolean;
}) {
  return (
    <div className=" flex flex-row gap-3">
      <div
        className=" relative px-4"
        style={white ? { backgroundColor: "#CE9E5E" } : undefined}
      >
        <Image
          src="/icons/Moving-icon.png"
          alt={"Moving Bus"}
          width={96}
          height={96}
          priority
          className={iconStyles.moving}
        />
        <div
          className=" absolute left-0 top-0 h-full w-full"
          style={white ? { backdropFilter: "invert(1)" } : undefined}
        />
      </div>
      <h2
        id="about-ritchie-s-bus-schedule"
        className=" mt-8 text-3xl font-bold"
      >
        {children}
      </h2>
    </div>
  );
}
