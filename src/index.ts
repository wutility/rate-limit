import { NextFunction, Request, Response } from "express";
import RateLimitBlackList from "./RateLimitBlackList";
import RateLimitStore from "./RateLimitStore";
import { Config } from "./types";

// default rate limit settings
let config: Config = {
  windowMs: 60000,
  max: 5,
  maxReputation: 1000,
  message: 'Too Many Requests',
  headers: true,
  keyGenerator: (req: Request) => {
    return (req.ip || req.headers['x-api-key']) as string;
  }
};

// Middleware to handle rate limiting
function rateLimit(options: Config) {

  if (options) config = { ...config, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    const key: string = config.keyGenerator(req);

    if (RateLimitBlackList.hasOne(key)) { return res.status(503).send(null); }
    if (!RateLimitStore.has(key)) { RateLimitStore.create(key) }

    let client = RateLimitStore.findOne(key);

    if (client.count >= config.max) {
      // Check if the time window has expired
      if (Date.now() - client.windowStart < config.windowMs) {

        if (config.headers) {
          res.set('Retry-After', '' + Math.ceil((config.windowMs - (Date.now() - client.windowStart)) / 1000));
          res.set('X-RateLimit-Limit', '' + config.max);
          res.set('X-RateLimit-Remaining', '' + 0);
        }
        
        return res.status(429).send(config.message);
      }

      // Reset the count if the time window has expired     
      RateLimitStore.reset(key)
    }
    // Increment the request count in the rate limit window
    RateLimitStore.increment(key)

    if (config.headers) {
      res.set('X-RateLimit-Limit', config.max.toString());
      res.set('X-RateLimit-Remaining', (config.max - client.count).toString());
    }

    next();
  }
};

// Middleware to ban and handle banned clients
function RateLimitBanHandler() {
  return (req: Request, res: Response, next: NextFunction) => {

    const key: string = config.keyGenerator(req);
    const client = RateLimitStore.findOne(key);

    if (client.reputation >= config.maxReputation) {
      RateLimitBlackList.addOne(key, client);
      return res.status(503).send(null);
    }
    next();
  }
};

export { rateLimit, RateLimitBanHandler, RateLimitStore, RateLimitBlackList };