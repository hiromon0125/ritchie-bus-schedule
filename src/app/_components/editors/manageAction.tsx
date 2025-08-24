"use server";

import { api } from "~/trpc/server";

export const flushAllCache = api.manager.flushAllCache;
