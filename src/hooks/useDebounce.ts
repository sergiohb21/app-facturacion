import { useState, useEffect } from 'react';

interface UseDebounceProps {
  value: any;
  delay?: number;
}

export function useDebounce({ value, delay = 300 }: UseDebounceProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}