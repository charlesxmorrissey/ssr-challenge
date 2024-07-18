interface Cache<T> {
  [key: string]: T[];
}

/**
 * Simple Cache Class
 *
 * This class provides a simple caching mechanism for storing and
 * retrieving values.
 * It can be used to improve performance by avoiding redundant calculations or
 * network requests by storing results.
 *
 * Usage:
 * const cache = new SimpleCache('key');
 * cache.set('value'); // Stores 'value' with the key 'key'
 * const value = cache.get(); // Retrieves the value associated with 'key'
 *
 * Methods:
 * - constructor(key: string): Initializes the cache with a specified key.
 * - get(): Retrieves a value from the cache by its key.
 * - set(value: any): Stores a value in the cache.
 * - clear(): Clears all values from the cache.
 * - size(): Retrieves the size of the cache.
 */
export class SimpleCache<T, K extends string = string> {
  private cache: Cache<T> = {};
  private key: K;

  constructor(key: K) {
    this.cache = {};
    this.key = key;
  }

  public get() {
    return this.cache[this.key];
  }

  public set(value: T[]) {
    this.cache[this.key] = value;
  }

  public clear() {
    delete this.cache[this.key];
  }

  public size() {
    return Object.keys(this.cache).length;
  }
}
