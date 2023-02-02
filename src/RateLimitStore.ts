import { Client } from "./types";

export default class RateLimitStore {

  // Object to store the rate limit information for each client
  static clients: Map<string, Client> = new Map()

  static create(key: string) {
    this.clients.set(key, { count: 0, windowStart: Date.now(), reputation: 0 })
  }

  static has(key: string): boolean {
    return key !== undefined && this.clients.has(key)
  }

  static findOne(key: string): Client {
    // return this.clients[key]
    return this.clients.get(key) as Client
  }

  static increment(key: string) {    
    const client = this.clients.get(key) as Client;
    const counter = client.count as number;
    this.clients.set(key, { ...client, count: counter + 1 })
  }

  static reset(key: string) {
    const client = this.clients.get(key) as Client;
    this.clients.set(key, { count: 0, windowStart: Date.now(), reputation: client.reputation + 1 })
  }

  static resetAll() {
    this.clients = new Map()
  }

  static findAll() {
    return Object.fromEntries(this.clients)
  }
}