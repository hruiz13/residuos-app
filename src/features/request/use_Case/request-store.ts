import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Request } from "../models/Request";
import requests from "@/mock/requests.json";
import { setRequestMockData } from "../datasource/setRequestMockData";

interface RequestStoreState {
  requests: Request[];
  createRequest: (request: Request) => Promise<void>;
  cancelRequest: (id: string) => Promise<void>;
  setPointsRequest: (id: string, points: number) => Promise<void>;
  getPendingRequests: () => Promise<Request[]>;
  setCollectorId: (id: string, collectorId: string) => Promise<void>;
  fillWithMockData?: () => Promise<void>;
}

export const useRequestStore = create<RequestStoreState>()(
  persist(
    (set, get) => ({
      requests: [],
      createRequest: async (request) => {
        set((state) => ({
          requests: [...state.requests, request],
        }));
      },
      cancelRequest: async (id) => {
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === id ? { ...req, estado: "cancelled" } : req
          ),
        }));
      },
      setPointsRequest: async (id, points) => {
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === id ? { ...req, putosObtenidos: points } : req
          ),
        }));
      },
      getPendingRequests: async () => {
        return get().requests?.filter(
          (req) => req.estado === "pending" && !req.collectorId
        );
      },
      setCollectorId: async (id, collectorId) => {
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === id ? { ...req, collectorId, estado: "assigned" } : req
          ),
        }));
      },
      fillWithMockData: async () => {
        const mockData = await setRequestMockData();
        set({ requests: mockData });
      },
    }),
    {
      name: "request-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
