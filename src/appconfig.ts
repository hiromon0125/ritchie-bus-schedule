import config from "../appconfig.json";
import packageInfo from "../package.json";
interface AppConfig {
  DOMAIN: string;
  APP_NAME: string;
  APP_TITLE: string;
  DESCRIPTION_LONG: string;
  DESCRIPTION_SHORT: string;
  VERSION: string;
  GITHUB_REPO: string;
  GITHUB_ISSUE: string;
  RATE: string;
}

export const APPCONFIG: AppConfig = {
  ...config,
  VERSION: packageInfo.version,
} as const;
