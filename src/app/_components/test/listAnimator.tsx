"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactElement, useRef, useState } from "react";

export function ClientListOrganizer({
  children,
  specialKeys,
}: {
  children: ReactElement[];
  specialKeys: string[];
}) {
  const [floatingChild, setFloatingChild] = useState<ReactElement | null>(null);
  const floatingDivRef = useRef<HTMLDivElement | null>(null);
  const [specialChildren, setSpecialChildren] = useState<ReactElement[]>(
    children.filter((child) => {
      return child.key ? specialKeys.includes(child.key) : false;
    }),
  );
  const specialDomRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [nonSpecialChildren, setNonSpecialChildren] = useState<ReactElement[]>(
    children.filter((child) => {
      return child.key ? !specialKeys.includes(child.key) : false;
    }),
  );
  const nonSpecialDomRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const animateClick = (i: number, isSpecial: boolean) => {
    // get target
    const targetChild = isSpecial ? specialChildren[i] : nonSpecialChildren[i];
    if (!targetChild) {
      console.log("target child not found");
      return;
    }
    // remove from list
    (isSpecial ? specialChildren : nonSpecialChildren).splice(i, 1);
    // add to new list
    (isSpecial ? setNonSpecialChildren : setSpecialChildren)((p) => [
      ...p,
      targetChild,
    ]);
  };

  const WrapSpecialComponent = (child: ReactElement, i: number) => {
    return (
      <motion.button
        key={child.key}
        ref={(el) => {
          specialDomRefs.current[i] = el;
        }}
        onClick={() => animateClick(i, true)}
      >
        {child}
      </motion.button>
    );
  };
  const WrapNonSpecialComponent = (child: ReactElement, i: number) => {
    return (
      <motion.button
        key={child.key}
        ref={(el) => {
          nonSpecialDomRefs.current[i] = el;
        }}
        onClick={() => animateClick(i, false)}
      >
        {child}
      </motion.button>
    );
  };

  return (
    <div className=" relative flex flex-col-reverse">
      <div className=" h-40">
        <p>regular</p>
        <div className=" flex flex-col justify-start gap-2">
          <AnimatePresence>
            {nonSpecialChildren.map(WrapNonSpecialComponent)}
          </AnimatePresence>
        </div>
      </div>
      <div className=" h-40">
        <p>special</p>
        <div className=" flex flex-col justify-start gap-2">
          <AnimatePresence>
            {specialChildren.map(WrapSpecialComponent)}
          </AnimatePresence>
        </div>
      </div>
      <div
        ref={(el) => {
          floatingDivRef.current = el;
        }}
        className=" absolute"
      >
        {floatingChild}
      </div>
    </div>
  );
}
