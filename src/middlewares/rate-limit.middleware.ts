import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../lib/redis";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },

  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});