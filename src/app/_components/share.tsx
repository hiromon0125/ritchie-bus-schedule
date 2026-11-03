"use client";

import {
  BlueskyIcon,
  BlueskyShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  XIcon,
  XShareButton,
} from "react-share";
import { APPCONFIG } from "../../appconfig";
export function Share() {
  const url = APPCONFIG.DOMAIN;
  const title = "Check this new RIT bus app I found!";
  const hashtags = ["RIT"];
  return (
    <div className="flex flex-row items-center gap-2">
      <BlueskyShareButton url={url} text={title} aria-label="Share on Bluesky">
        <BlueskyIcon size={36} />
      </BlueskyShareButton>
      <XShareButton
        text={title}
        url={url}
        hashtags={hashtags}
        aria-label="Share on X"
      >
        <XIcon size={38} />
      </XShareButton>
      <FacebookShareButton
        url={url}
        title={title}
        hashtag="#RIT"
        aria-label="Share on Facebook"
      >
        <FacebookIcon size={35} />
      </FacebookShareButton>
      <RedditShareButton
        shareTitle={title}
        url={url}
        className="flex flex-row items-center gap-3"
        aria-label="Share on Reddit"
      >
        <RedditIcon size={32} />
      </RedditShareButton>
      <LinkedinShareButton url={url} aria-label="Share on LinkedIn">
        <LinkedinIcon size={33} />
      </LinkedinShareButton>
    </div>
  );
}
