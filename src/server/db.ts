import { PrismaClient } from "@prisma/client";

import { Redis } from "@upstash/redis";
import { env } from "~/env";

const createRedisClient = () =>
  new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForDB = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
  redis: ReturnType<typeof createRedisClient> | undefined;
};

export const cache = globalForDB.redis ?? createRedisClient();
export const db = globalForDB.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForDB.prisma = db;
if (env.NODE_ENV !== "production") globalForDB.redis = cache;
