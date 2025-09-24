import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Request } from '../models/Request';

interface RequestStoreState {
  requests: Request[];
  createRequest: (request: Request) => void;
  cancelRequest: (id: string) => void;
  setPointsRequest: (id: string, points: number) => void;
  getPendingRequests: () => Promise<Request[]>;
  setCollectorId: (id: string, collectorId: string) => Promise<void>;
}

export const useRequestStore = create<RequestStoreState>()(
  persist(
    (set, get) => ({
      requests: [],
      createRequest: (request) =>
        set((state) => ({
          requests: [...state.requests, request],
        })),
      cancelRequest: (id) =>
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === id ? { ...req, estado: 'cancelled' } : req
          ),
        })),
      setPointsRequest: (id, points) =>
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === id ? { ...req, putosObtenidos:points } : req
          ),
        })),
      getPendingRequests: async() => {
        return get().requests.filter((req) => req.estado === 'pending' && !req.collectorId);
      },
      setCollectorId: async (id, collectorId) => {
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === id ? { ...req, collectorId, estado: 'assigned' } : req
          ),
        }));
      }
    }),
    {
      name: 'request-store',
      storage: createJSONStorage(() => localStorage),
      version:1,
    }
  )
);