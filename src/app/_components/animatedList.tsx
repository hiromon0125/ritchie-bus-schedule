"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactElement, useState } from "react";

export function AnimatedDoubleList({
  children,
  emptySection,
  favoritedBusKeys,
  locked,
}: {
  children: ReactElement[];
  emptySection: React.ReactNode;
  favoritedBusKeys: string[];
  locked?: boolean;
}) {
  const [favoritedChildren, setFavoritedChildren] = useState<ReactElement[]>(
    children.filter((child) => {
      return child.key ? favoritedBusKeys.includes(child.key) : false;
    }),
  );
  const [unfavoritedChildren, setUnfavoritedChildren] = useState<
    ReactElement[]
  >(
    children.filter((child) => {
      return child.key ? !favoritedBusKeys.includes(child.key) : false;
    }),
  );

  return (
    <div className="bg-border-background xs:gap-3 xs:rounded-3xl xs:p-3 flex w-(--sm-max-w) flex-col gap-2 rounded-[20px] p-2 md:max-w-(--breakpoint-lg)">
      <div className="bg-item-background flex flex-row justify-between rounded-xl p-3 py-2">
        <h2 className="xs:text-2xl m-0 text-xl font-bold">Favorite Buses</h2>
      </div>
      <div className="xs:gap-3 relative flex max-w-(--breakpoint-lg) flex-row flex-wrap gap-2 md:min-w-80">
        <AnimatePresence>
          {favoritedChildren.length === 0
            ? emptySection
            : favoritedChildren.map((child, i) => (
                <motion.div
                  key={child.key}
                  className="w-auto min-w-full flex-1 md:max-w-[calc(50%-6px)] md:min-w-[40%]"
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ type: "spring", duration: 1 }}
                  onClick={() => {
                    if (locked) return;
                    favoritedChildren.splice(i, 1);
                    setUnfavoritedChildren((p) => [...p, child]);
                  }}
                >
                  {child}
                </motion.div>
              ))}
        </AnimatePresence>
      </div>
      <div className="bg-item-background flex flex-row justify-between rounded-xl p-3 py-2">
        <h1 className="xs:text-2xl m-0 text-xl font-bold">Buses</h1>
      </div>
      <div className="xs:gap-3 relative flex max-w-(--breakpoint-lg) flex-row flex-wrap gap-2 md:min-w-80">
        <AnimatePresence>
          {unfavoritedChildren.map((child, i) => (
            <motion.div
              className="w-auto min-w-full flex-1 md:max-w-[calc(50%-6px)] md:min-w-[40%]"
              key={child.key}
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ type: "spring", duration: 1 }}
              onClick={() => {
                if (locked) return;
                unfavoritedChildren.splice(i, 1);
                setFavoritedChildren((p) => [...p, child]);
              }}
            >
              {child}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ClickEventBlocker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {children}
    </div>
  );
}
