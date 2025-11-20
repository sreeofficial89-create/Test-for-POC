import { useEffect, useState } from 'react';

/**
 * Reusable localStorage hook. It reads the initial value once on mount (inside
 * useEffect to avoid SSR issues) and keeps the state + storage in sync.
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Unable to read ${key} from localStorage`, error);
    }
    // We intentionally run only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Unable to write ${key} to localStorage`, error);
      }
      return valueToStore;
    });
  };

  return [storedValue, setValue] as const;
};
