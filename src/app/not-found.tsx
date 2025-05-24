import { APPCONFIG } from "../appconfig";
import { ErrorPage } from "./_components/errorPage";

export const metadata = {
  title: `404 Not found | ${APPCONFIG.APP_TITLE}`,
};

export default function NotFound() {
  return (
    <ErrorPage
      statusCode={404}
      statusMeaning="Not Found"
      statusMessage="The page you are looking for does not exist."
    />
  );
}
