// src/services/offlineService.ts
import axios from "axios";
const API_URL = "http://localhost:3000/destinations";
//const API_URL = "http://172.30.245.117:3000/destinations";

const QUEUE_KEY = 'offline_operations';

export const offlineService = {
  getQueue: () => {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  },

  addToQueue: (operation: { type: string; payload: any }) => {
    const queue = offlineService.getQueue();
    queue.push(operation);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  clearQueue: () => {
    localStorage.removeItem(QUEUE_KEY);
  },

  processQueue: async () => {
    const queue = offlineService.getQueue();
    if (queue.length === 0) return;

    try {
      for (const op of queue) {
        switch (op.type) {
          case 'ADD':
            await axios.post(API_URL, op.payload);
            break;
          case 'UPDATE':
            await axios.patch(`${API_URL}/${op.payload.id}`, op.payload);
            break;
          case 'DELETE':
            await axios.delete(`${API_URL}/${op.payload.id}`);
            break;
        }
      }
      offlineService.clearQueue();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
};