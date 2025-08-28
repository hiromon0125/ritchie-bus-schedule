"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { type ReactElement, useEffect, useState } from "react";

type ChildDataProp = {
  "data-bus-id"?: string;
};

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
    [],
  );
  const [unfavoritedChildren, setUnfavoritedChildren] = useState<
    ReactElement[]
  >([]);

  useEffect(() => {
    const childrenArray = React.Children.toArray(children) as ReactElement[];
    const fav: ReactElement[] = [];
    const unfav: ReactElement[] = [];

    for (const child of childrenArray) {
      if (!React.isValidElement(child)) continue;
      const busId = (child.props as ChildDataProp)["data-bus-id"];
      if (busId && favoritedBusKeys.includes(busId)) fav.push(child);
      else unfav.push(child);
    }

    setFavoritedChildren(fav);
    setUnfavoritedChildren(unfav);
  }, [children, favoritedBusKeys]);

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
