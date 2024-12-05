import { Redis } from 'ioredis';

export default class RedisService {
  private readonly redis: Redis;

  constructor() {
    try {
      const redisConfig = {
        host: process.env.QUEUE_HOST,
        port: parseInt(process.env.QUEUE_PORT, 10),
        password: process.env.QUEUE_PASS,
      };

      // Client dùng cho lưu trữ dữ liệu
      this.redis = new Redis(redisConfig);
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
    // this.redis.config('SET', 'notify-keyspace-events', 'Ex');
  }

  publish(channel: string, message: string) {
    return this.redis.publish(channel, message);
  }

  /**
   * Set method
   * @param {String} key
   * @param {String} value
   */
  set(key: any, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redis.set(key, value, (err: Error) => {
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
      return this.redis.set(key, value, 'EX', duration, (err: Error) => {
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
      return this.redis.del(key, (err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  public get(key: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      return this.redis.get(key, (err: Error | null, reply: any) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  }

  public getExpired(key: string): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      this.redis.ttl(key, (err: Error | null, ttl: number | undefined) => {
        if (err) {
          reject(err);
        }
        resolve(ttl);
      });
    });
  }

  // Add item to set
  sadd(key: string, valueData: any) {
    return this.redis.sadd(key, valueData);
  }

  /**
   * Check phần tử tồn tại
   * @param key
   * @param valueData
   * @returns
   */
  sismember(key: string, valueData: any) {
    return this.redis.sismember(key, valueData);
  }

  // Get all item in arr
  smembers(key: string) {
    return this.redis.smembers(key);
  }

  /**
   * Xóa một phần tửu trong set
   */
  srem(key: string, valueData: any) {
    return this.redis.srem(key, valueData);
  }

  async hget(key: string, field: string) {
    return await this.redis.hget(key, field);
  }

  async hgetAll(key: string) {
    return await this.redis.hgetall(key);
  }

  async hset(key: string, field: string, fieldValue: any) {
    return await this.redis.hset(key, field, fieldValue);
  }

  async hdel(key: string, value: string) {
    await this.redis.hdel(key, value);
  }

  getClient(): Redis {
    return this.redis;
  }

  // Lấy client cho adapter
  // getSubscriberClient(): Redis {
  //   return this.redis;
  // }
}
