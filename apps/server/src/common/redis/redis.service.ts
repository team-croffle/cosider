import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS_CLIENT } from '@/common/constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    return val ? (JSON.parse(val) as T) : null;
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  /**
   * 기존 TTL을 유지한 채 JSON 값을 갱신한다.
   * TTL이 없거나 만료된 키면 ttlSecondsFallback을 사용한다.
   */
  async setJsonPreservingTtl<T>(key: string, value: T, ttlSecondsFallback?: number): Promise<void> {
    const ttl = await this.client.ttl(key);
    if (ttl > 0) {
      await this.set(key, JSON.stringify(value), ttl);
      return;
    }
    await this.set(key, JSON.stringify(value), ttlSecondsFallback);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }
}
