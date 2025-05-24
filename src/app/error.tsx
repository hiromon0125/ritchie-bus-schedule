"use client"; // Error boundaries must be Client Components

import posthog from "posthog-js";
import { useEffect } from "react";
import { ErrorPage } from "./_components/errorPage";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <ErrorPage
      statusCode={500}
      statusMeaning="Internal Server Error"
      statusMessage={error.message}
    />
  );
}
