import type IORedis from "ioredis";
import { createRedisConnection } from "./redis";

let sharedRedis: IORedis | null = null;

export function getSharedRedis() {
  if (!sharedRedis) {
    sharedRedis = createRedisConnection();
  }
  return sharedRedis;
}
