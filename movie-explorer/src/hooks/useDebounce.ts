import { useEffect, useState } from 'react';

/**
 * Small helper hook that delays updating a value until the user stops typing.
 * We use it for the search input so we do not spam the API with every keystroke.
 */
export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};
