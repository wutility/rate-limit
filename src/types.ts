import { Request } from "express";

export type Config = {
  windowMs: number, // Time window in milliseconds (1 min)
  max: number, // Max number of requests allowed in a time window
  maxReputation: number, // Max number of reputations allowed (next add to blacklist)
  message: string,
  headers: boolean, // Include the rate limit in the response headers

  // Generate a unique key based on the client's IP, API key or JWT token
  keyGenerator: (req: Request) => string
}

export type Client = {
  count: number,
  windowStart: number,
  reputation: number
}