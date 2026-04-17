import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Keep this tolerant so commands like `prisma generate` can still run in
    // environments where DATABASE_URL is not present.
    url: env("DATABASE_URL"),
  },
});
