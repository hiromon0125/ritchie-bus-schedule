"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { Suspense, useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";
import posthog, { type CaptureResult } from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { env } from "../../env";

/** App bundles are served from this path; third-party frames never are. */
const FIRST_PARTY_PATH = "/_next/static/";

interface ExceptionFrame {
  filename?: string;
}

interface ExceptionListItem {
  stacktrace?: { frames?: ExceptionFrame[] };
}

/**
 * Returns true when any stack frame points at this app's own code. Browser
 * extensions and the host browser inject scripts whose frames are the
 * document URL, a vendor CDN, or absent, so an exception with no first-party
 * frame did not come from this app and cannot be acted on.
 */
function hasFirstPartyFrame(event: CaptureResult): boolean {
  const exceptions = event.properties.$exception_list as
    | ExceptionListItem[]
    | undefined;
  return (exceptions ?? []).some((exception) =>
    (exception.stacktrace?.frames ?? []).some((frame) =>
      frame.filename?.includes(FIRST_PARTY_PATH),
    ),
  );
}

/**
 * Drops `$exception` events that carry no first-party frame, so wallet
 * extensions, Dark Reader, host-browser injections, and cross-origin
 * "Script error." noise stay out of error tracking. Every other event and
 * genuine app exceptions pass through untouched.
 */
function dropThirdPartyExceptions(event: CaptureResult | null) {
  if (event?.event === "$exception" && !hasFirstPartyFrame(event)) {
    return null;
  }
  return event;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (env.NEXT_PUBLIC_POSTHOG_KEY == undefined) {
      console.warn(
        "PostHog is disabled because NEXT_PUBLIC_POSTHOG_KEY is missing from this browser build.",
      );
      return;
    }
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      ui_host: "https://us.posthog.com",
      defaults: "2026-05-30",
      person_profiles: "always", // or 'always' to create profiles for anonymous users as well
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true, // Capture pageleave events
      capture_dead_clicks: true, // Capture dead clicks
      before_send: dropThirdPartyExceptions,
      on_request_error: () => {
        console.error("PostHog request failed");
      },
    });
    setIsInitialized(true);
  }, []);

  return (
    <PHProvider client={posthog}>
      {isInitialized && <SuspendedPostHogPageView />}
      {isInitialized && <PostHogUserIdentifier />}
      {children}
    </PHProvider>
  );
}

/** Identifies the current Clerk user without rendering any UI. */
function PostHogUserIdentifier() {
  const { isLoaded, user } = useUser();
  const posthog = usePostHog();

  useEffect(() => {
    if (!isLoaded || !posthog) {
      return;
    }

    if (user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
      });
      return;
    }
  }, [isLoaded, posthog, user]);

  return null;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);
  return null;
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
