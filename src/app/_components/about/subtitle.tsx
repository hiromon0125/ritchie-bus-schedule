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
    <div className=" flex flex-row items-center gap-3">
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
          className={`${iconStyles.moving} h-16 w-16 md:h-24 md:w-24`}
        />
        <div
          className=" absolute left-0 top-0 h-full w-full"
          style={
            white
              ? {
                  backdropFilter: "invert(1)",
                  WebkitBackdropFilter: "invert(1)",
                }
              : undefined
          }
        />
      </div>
      <h2
        id="about-ritchie-s-bus-schedule"
        className=" text-xl font-bold md:text-3xl"
      >
        {children}
      </h2>
    </div>
  );
}
