// src/services/offlineService.ts
import axios from "axios";

const API_URL = "http://localhost:3000/destinations";

let operationQueue: Array<{ type: 'CREATE' | 'UPDATE' | 'DELETE', payload: any }> = [];

export const offlineService = {
  getQueue: () => [...operationQueue], // Return a copy

  addToQueue: (operation: { type: 'CREATE' | 'UPDATE' | 'DELETE', payload: any }) => {
    operationQueue.push(operation);
  },

  clearQueue: () => {
    operationQueue = [];
  },

  processQueue: async () => {
    if (operationQueue.length === 0) return;

    try {
      // Process in order
      for (const op of operationQueue) {
        switch (op.type) {
          case 'CREATE': // Changed from 'ADD' to match your usage
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
      return true; // Indicate success
    } catch (error) {
      console.error('Sync failed:', error);
      throw error; // Re-throw to handle in component
    }
  }
};