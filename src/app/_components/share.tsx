"use client";

import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";
export function Share() {
  const url = "rit-bus.app";
  const title = "Check this new RIT bus app I found!";
  return (
    <div className="flex flex-row gap-2">
      <RedditShareButton
        title={title}
        url={url}
        className=" flex flex-row items-center gap-3"
        aria-label="Share on Reddit"
      >
        <RedditIcon round size={36} />
      </RedditShareButton>
      <TwitterShareButton
        title={title}
        url={url}
        hashtags={["RIT"]}
        aria-label="Share on X"
      >
        <XIcon round size={36} />
      </TwitterShareButton>
      <FacebookShareButton url={url} aria-label="Share on Facebook">
        <FacebookIcon round size={36} />
      </FacebookShareButton>
      <LinkedinShareButton url={url} aria-label="Share on LinkedIn">
        <LinkedinIcon round size={36} />
      </LinkedinShareButton>
    </div>
  );
}
