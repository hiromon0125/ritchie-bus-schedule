"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

export default function ClickableTooltip({
  children,
  tipMessage,
}: {
  children: React.ReactNode;
  tipMessage: string;
}) {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the tooltip to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <TooltipProvider>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild onClick={() => setOpen(!open)}>
            <Button
              variant="ghost"
              className=" aspect-square p-0 py-0 hover:bg-slate-300"
            >
              {children}
            </Button>
          </TooltipTrigger>
          <div ref={tooltipRef}>
            <TooltipContent>
              <p>{tipMessage}</p>
            </TooltipContent>
          </div>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
