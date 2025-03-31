"use client";

import { useState } from "react";
import { FaLink } from "react-icons/fa";
import { toast } from "sonner";
import { getBaseUrl } from "t/react";
import { Button } from "../../components/ui/button";

export default function CopyLink({ link }: { link: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyLink = async () => {
    const url = `${getBaseUrl()}${link.trim()}`;
    setIsLoading(true);
    console.log(`Copying link: ${url}`);

    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard!", {
        duration: 3000,
      });
    } catch {
      toast("Failed to copy link", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCopyLink}
      disabled={isLoading}
      variant="link"
      className="text-foreground aspect-square h-11 p-2"
    >
      <FaLink color="inherit" size={32} className="scale-125" />
    </Button>
  );
}
