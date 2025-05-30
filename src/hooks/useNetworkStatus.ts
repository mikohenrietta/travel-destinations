// src/hooks/useNetworkStatus.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_URL}/destinations`;


export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServerOnline, setIsServerOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check server status periodically
    const interval = setInterval(async () => {
      try {
        await axios.get(API_URL, { timeout: 5000 });
        setIsServerOnline(true);
      } catch {
        setIsServerOnline(false);
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, isServerOnline };
}