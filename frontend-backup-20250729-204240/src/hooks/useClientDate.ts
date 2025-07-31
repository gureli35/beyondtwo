import { useState, useEffect } from 'react';

/**
 * Hook to safely get current date on client side
 * Prevents hydration mismatch between server and client
 */
export const useClientDate = () => {
  const [clientDate, setClientDate] = useState<Date | null>(null);

  useEffect(() => {
    setClientDate(new Date());
  }, []);

  return clientDate;
};
