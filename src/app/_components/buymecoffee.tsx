"use client";
import Image from "next/image";

function Coffee() {
  return (
    <a href="https://www.buymeacoffee.com/hiromon0125" target="_blank">
      <Image
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        width={217}
        height={60}
        style={{ height: "60px", width: "217px" }}
      ></Image>
    </a>
  );
}

export default Coffee;
