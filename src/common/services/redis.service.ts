import { Redis } from 'ioredis';

export default class RedisService {
  private readonly client: Redis;
  private readonly subscriber: Redis;

  constructor() {
    try {
      this.client = new Redis({
        host: process.env.QUEUE_HOST,
        port: parseInt(process.env.QUEUE_PORT, 10),
        password: String(process.env.QUEUE_PASS),
      });
      this.subscriber = new Redis({
        host: process.env.QUEUE_HOST,
        port: parseInt(process.env.QUEUE_PORT, 10),
        password: String(process.env.QUEUE_PASS),
      });
    } catch (error) {
      console.log(
        '🚀 ~ RedisService ~ constructor ~ error:',
        error,
        process.env.QUEUE_HOST,
        process.env.QUEUE_PORT,
        process.env.QUEUE_PASS,
      );
    }

    // Enable keyspace notifications
    // this.client.config('SET', 'notify-keyspace-events', 'Ex');
  }

  publish(channel: string, message: string) {
    return this.client.publish(channel, message);
  }

  getSubscriber(): Redis {
    return this.subscriber;
  }

  /**
   * Set method
   * @param {String} key
   * @param {String} value
   */
  set(key: any, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * Set Expiration method
   * @param {string} key
   * @param {string} value
   * @param {string} mode
   * @param {number} duration EX for seconds
   */
  setExpire(key: string, value: string, duration: number): Promise<void> {
    return new Promise((resolve, reject) => {
      return this.client.set(key, value, 'EX', duration, (err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * Delete method
   * @param {string} key
   */
  del(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      return this.client.del(key, (err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  public get(key: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      return this.client.get(key, (err: Error | null, reply: any) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  }

  public getExpired(key: string): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      this.client.ttl(key, (err: Error | null, ttl: number | undefined) => {
        if (err) {
          reject(err);
        }
        resolve(ttl);
      });
    });
  }

  // Add item to set
  sadd(key: string, valueData: any) {
    return this.client.sadd(key, valueData);
  }

  /**
   * Check phần tử tồn tại
   * @param key
   * @param valueData
   * @returns
   */
  sismember(key: string, valueData: any) {
    return this.client.sismember(key, valueData);
  }

  // Get all item in arr
  smembers(key: string) {
    return this.client.smembers(key);
  }

  /**
   * Xóa một phần tửu trong set
   */
  srem(key: string, valueData: any) {
    return this.client.srem(key, valueData);
  }

  async hget(key: string, field: string) {
    return await this.client.hget(key, field);
  }

  async hgetAll(key: string) {
    return await this.client.hgetall(key);
  }

  async hset(key: string, field: string, fieldValue: any) {
    return await this.client.hset(key, field, fieldValue);
  }

  async hdel(key: string, value: string) {
    await this.client.hdel(key, value);
  }

  getClient(): Redis {
    return this.client;
  }
}
