import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Request } from '../models/Request';

interface RequestStoreState {
  requests: Request[];
  createRequest: (request: Request) => void;
  cancelRequest: (id: string) => void;
  setPointsRequest: (id: string, points: number) => void;
}

export const useRequestStore = create<RequestStoreState>()(
  persist(
    (set) => ({
      requests: [],
      createRequest: (request) =>
        set((state) => ({
          requests: [...state.requests, request],
        })),
      cancelRequest: (id) =>
        set((state) => ({
          requests: state.requests.filter((req) => req.id !== id),
        })),
      setPointsRequest: (id, points) =>
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === id ? { ...req, putosObtenidos:points } : req
          ),
        })),
    }),
    {
      name: 'request-store',
      storage: createJSONStorage(() => localStorage),
      version:1,
    }
  )
);