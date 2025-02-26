"use client";
import Image from "next/image";

const SIZESTYLE = {
  default: { height: 64, width: 231 },
  medium: { height: 48, width: 173 },
  small: { height: 32, width: 115 },
};

function Coffee({ size = "default" }: { size?: keyof typeof SIZESTYLE }) {
  return (
    <a href="https://www.buymeacoffee.com/hiromon0125" target="_blank">
      <Image
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        width={SIZESTYLE[size].width}
        height={SIZESTYLE[size].height}
      />
    </a>
  );
}

export default Coffee;
