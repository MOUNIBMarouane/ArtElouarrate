/**
 * 🎨 Professional Caching System
 * High-performance caching with Redis support and memory optimization
 */

import { createClient } from 'redis';

class ProfessionalCache {
  constructor(options = {}) {
    this.options = {
      defaultTTL: options.defaultTTL || 300, // 5 minutes
      maxMemoryItems: options.maxMemoryItems || 10000,
      cleanupInterval: options.cleanupInterval || 60000, // 1 minute
      enableRedis: options.enableRedis || false,
      redisUrl: options.redisUrl || process.env.REDIS_URL,
      ...options
    };

    // Memory cache
    this.memoryCache = new Map();
    this.memoryTTL = new Map();
    
    // Statistics
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      memoryHits: 0,
      redisHits: 0,
      errors: 0
    };

    // Redis client
    this.redisClient = null;
    this.redisConnected = false;

    this.init();
  }

  async init() {
    // Initialize Redis if enabled
    if (this.options.enableRedis && this.options.redisUrl) {
      try {
        this.redisClient = createClient({
          url: this.options.redisUrl,
          socket: {
            reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
          }
        });

        this.redisClient.on('error', (err) => {
          console.error('Redis error:', err);
          this.redisConnected = false;
          this.stats.errors++;
        });

        this.redisClient.on('connect', () => {
          console.log('✅ Redis connected');
          this.redisConnected = true;
        });

        await this.redisClient.connect();
      } catch (error) {
        console.warn('⚠️ Redis connection failed, using memory cache only:', error.message);
        this.redisConnected = false;
      }
    }

    // Start cleanup interval
    this.startCleanup();
  }

  startCleanup() {
    setInterval(() => {
      this.cleanupExpired();
    }, this.options.cleanupInterval);
  }

  cleanupExpired() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, expiry] of this.memoryTTL.entries()) {
      if (now > expiry) {
        this.memoryCache.delete(key);
        this.memoryTTL.delete(key);
        cleaned++;
      }
    }

    // Limit memory cache size
    if (this.memoryCache.size > this.options.maxMemoryItems) {
      const excess = this.memoryCache.size - this.options.maxMemoryItems;
      const keysToDelete = Array.from(this.memoryCache.keys()).slice(0, excess);
      
      keysToDelete.forEach(key => {
        this.memoryCache.delete(key);
        this.memoryTTL.delete(key);
        cleaned++;
      });
    }

    if (cleaned > 0) {
      console.log(`🧹 Cache cleanup: removed ${cleaned} expired/excess entries`);
    }
  }

  generateKey(prefix, ...parts) {
    return `${prefix}:${parts.join(':')}`;
  }

  async set(key, value, ttlSeconds = this.options.defaultTTL) {
    try {
      this.stats.sets++;
      const serializedValue = JSON.stringify(value);
      const expiry = Date.now() + (ttlSeconds * 1000);

      // Set in memory cache
      this.memoryCache.set(key, value);
      this.memoryTTL.set(key, expiry);

      // Set in Redis if available
      if (this.redisConnected) {
        await this.redisClient.setEx(key, ttlSeconds, serializedValue);
      }

      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async get(key) {
    try {
      // Check memory cache first (L1)
      const memoryExpiry = this.memoryTTL.get(key);
      if (memoryExpiry && Date.now() <= memoryExpiry) {
        this.stats.hits++;
        this.stats.memoryHits++;
        return this.memoryCache.get(key);
      }

      // Remove expired from memory
      if (memoryExpiry) {
        this.memoryCache.delete(key);
        this.memoryTTL.delete(key);
      }

      // Check Redis (L2)
      if (this.redisConnected) {
        const redisValue = await this.redisClient.get(key);
        if (redisValue) {
          try {
            const value = JSON.parse(redisValue);
            
            // Promote to memory cache
            this.memoryCache.set(key, value);
            this.memoryTTL.set(key, Date.now() + (this.options.defaultTTL * 1000));
            
            this.stats.hits++;
            this.stats.redisHits++;
            return value;
          } catch (parseError) {
            console.error('Cache parse error:', parseError);
          }
        }
      }

      this.stats.misses++;
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.errors++;
      return null;
    }
  }

  async delete(key) {
    try {
      this.stats.deletes++;
      
      // Delete from memory
      this.memoryCache.delete(key);
      this.memoryTTL.delete(key);

      // Delete from Redis
      if (this.redisConnected) {
        await this.redisClient.del(key);
      }

      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async clear() {
    try {
      // Clear memory
      this.memoryCache.clear();
      this.memoryTTL.clear();

      // Clear Redis
      if (this.redisConnected) {
        await this.redisClient.flushDb();
      }

      // Reset stats
      this.stats = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        memoryHits: 0,
        redisHits: 0,
        errors: 0
      };

      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async invalidatePattern(pattern) {
    try {
      let invalidated = 0;

      // Invalidate memory cache
      const regex = new RegExp(pattern);
      for (const key of this.memoryCache.keys()) {
        if (regex.test(key)) {
          this.memoryCache.delete(key);
          this.memoryTTL.delete(key);
          invalidated++;
        }
      }

      // Invalidate Redis cache
      if (this.redisConnected) {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
          invalidated += keys.length;
        }
      }

      console.log(`🗑️ Invalidated ${invalidated} cache entries matching: ${pattern}`);
      return invalidated;
    } catch (error) {
      console.error('Cache invalidation error:', error);
      this.stats.errors++;
      return 0;
    }
  }

  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 
      ? ((this.stats.hits / totalRequests) * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      memorySize: this.memoryCache.size,
      redisConnected: this.redisConnected,
      memoryUsage: `${(JSON.stringify([...this.memoryCache.values()]).length / 1024).toFixed(2)} KB`
    };
  }

  // Specialized cache methods for common patterns
  async setJSON(key, value, ttl) {
    return this.set(key, value, ttl);
  }

  async getJSON(key) {
    return this.get(key);
  }

  async remember(key, fetcher, ttl = this.options.defaultTTL) {
    let value = await this.get(key);
    
    if (value === null) {
      value = await fetcher();
      if (value !== null && value !== undefined) {
        await this.set(key, value, ttl);
      }
    }
    
    return value;
  }

  async rememberForever(key, fetcher) {
    return this.remember(key, fetcher, 86400 * 365); // 1 year
  }

  // Health check
  async healthCheck() {
    try {
      const testKey = 'health_check_' + Date.now();
      const testValue = { test: true, timestamp: Date.now() };
      
      await this.set(testKey, testValue, 10);
      const retrieved = await this.get(testKey);
      await this.delete(testKey);
      
      return {
        healthy: retrieved && retrieved.test === true,
        memoryCache: this.memoryCache.size > 0 ? 'working' : 'empty',
        redisCache: this.redisConnected ? 'connected' : 'disconnected',
        stats: this.getStats()
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        stats: this.getStats()
      };
    }
  }

  async disconnect() {
    if (this.redisClient) {
      await this.redisClient.disconnect();
    }
  }
}

// Cache middleware factory
export const createCacheMiddleware = (cache, options = {}) => {
  return (ttl = 300, keyGenerator = null) => {
    return async (req, res, next) => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Generate cache key
      const key = keyGenerator 
        ? keyGenerator(req) 
        : cache.generateKey('api', req.originalUrl, req.userId || 'anonymous');

      try {
        // Try to get from cache
        const cached = await cache.get(key);

        if (cached) {
          console.log(`📦 Cache HIT: ${key}`);
          return res.json(cached);
        }

        console.log(`🔍 Cache MISS: ${key}`);

        // Store original json method
        const originalJson = res.json;
        res.json = function(data) {
          // Only cache successful responses
          if (res.statusCode === 200 && data) {
            cache.set(key, data, ttl).catch(console.error);
            console.log(`💾 Cached: ${key} (TTL: ${ttl}s)`);
          }
          return originalJson.call(this, data);
        };

        next();
      } catch (error) {
        console.error('Cache middleware error:', error);
        next();
      }
    };
  };
};

// Global cache instance
export const cache = new ProfessionalCache({
  enableRedis: !!process.env.REDIS_URL,
  defaultTTL: parseInt(process.env.CACHE_TTL_DEFAULT) || 300,
  maxMemoryItems: parseInt(process.env.CACHE_MAX_MEMORY_ITEMS) || 10000
});

// Cache utilities
export const invalidateUserCache = (userId) => {
  return cache.invalidatePattern(`*:${userId}:*`);
};

export const invalidateArtworkCache = () => {
  return cache.invalidatePattern('api:*artworks*');
};

export const invalidateCategoryCache = () => {
  return cache.invalidatePattern('api:*categories*');
};

export const getCacheMiddleware = createCacheMiddleware(cache);

export default cache; 