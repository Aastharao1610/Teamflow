import rateLimit from "express-rate-limit";
import redis from "../lib/redis";
import RedisStore, { type RedisReply } from "rate-limit-redis";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },

  store: new RedisStore({
    sendCommand: async (command: string, ...args: string[]) => {
      return (await redis.call(command, ...args)) as RedisReply;
    },
  }),
});
