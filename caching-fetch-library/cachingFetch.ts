import { useEffect, useState } from 'react';
import { SimpleCache } from './simple-cache';

// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge

interface Person {
  first: string;
  last: string;
  email: string;
  address: string;
  created: string;
  balance: string;
}

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: Person[];
  error: Error | null;
};

// Create a new SimpleCache instance.
const cache = new SimpleCache<Person>('personData');

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const useCachingFetch: UseCachingFetch = (url) => {
  const [data, setData] = useState(cache.get() ?? []);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // If the cache is set, don't do anything.
      if (cache.size()) {
        return;
      }

      try {
        // Fetch the data if the cache is empty.
        if (!cache.get()) {
          setIsLoading(true);

          const data = await preloadCachingFetch(url);

          setData(data);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setError(error as Error | null);
      }
    };

    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<Person[]> => {
  // If the data isn't stored in the cache, fetch it, and set the cache.
  if (!cache.get()) {
    const response = await fetch(url);
    const data = await response.json();

    cache.set(data);
  }

  // Return the data stored in the cache.
  return cache.get();
};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const serializeCache = (): string => {
  if (cache.size()) {
    // Convert the cached data to a JSON string.
    return JSON.stringify(cache.get());
  } else {
    return '';
  }
};

export const initializeCache = (serializedCache: string): void => {
  // Set the cache with the parsed value.
  cache.set(JSON.parse(serializedCache));
};

export const wipeCache = (): void => {
  // Remove the cached data to prevent hydration errors.
  cache.clear();
};
