import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const CACHE_TTL = 60 * 60 * 24; // 24 hours in seconds

export async function getCachedUsername(
  publicKey: string
): Promise<string | null> {
  try {
    return await redis.get(`username:${publicKey}`);
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

export async function setCachedUsername(
  publicKey: string,
  username: string
): Promise<void> {
  try {
    await redis.set(`username:${publicKey}`, username, { ex: CACHE_TTL });
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

export default redis;
