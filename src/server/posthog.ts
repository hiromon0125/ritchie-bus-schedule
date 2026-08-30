import { PostHog } from "posthog-node";

import { env } from "~/env";

let client: PostHog | undefined;

function getClient() {
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) {
    return undefined;
  }

  client ??= new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });

  return client;
}

/** Capture a server event without allowing analytics failures to affect a request. */
export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: {
  distinctId: string;
  event: string;
  properties?: Record<string, string | number>;
}) {
  const posthog = getClient();
  if (!posthog) {
    return;
  }

  try {
    posthog.capture({ distinctId, event, properties });
    await posthog.flush();
  } catch (error) {
    console.error("PostHog server event delivery failed", error);
  }
}
