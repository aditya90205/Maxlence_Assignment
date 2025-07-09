import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

export const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Redis connection established successfully");
  } catch (error) {
    console.error("Redis connection failed:", error);
  }
};

export default client;
