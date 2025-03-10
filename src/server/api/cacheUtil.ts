export const LONG_CACHE_TIME_OPTION = { ex: 60 * 60 * 24 * 7 }; // 7 days

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
