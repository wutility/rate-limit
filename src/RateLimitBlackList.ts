import { Client } from "./types";

export default class RateLimitBlackList {
  static blackList: Map<string, Client> = new Map()

  static addOne(key: string, client: Client) {

    if (client === undefined) {
      this.blackList.set(key, { count: 0, windowStart: Date.now(), reputation: 0 });
      return
    }

    if (client && !this.blackList.has(key)) this.blackList.set(key, client)
  }

  static hasOne(key: string) { return key !== undefined && this.blackList.has(key) }

  static findOne(key: string) { this.blackList.get(key) }

  static findAll() { Object.fromEntries(this.blackList) }
}