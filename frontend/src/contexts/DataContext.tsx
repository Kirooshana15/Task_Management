import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type ServiceRequest, type WorkItem, type RequestStatus, type WorkItemStatus } from "@/data/mockData";
import { useAuth } from "./AuthContext";
import api from "@/lib/api";

interface DataContextType {
  requests: ServiceRequest[];
  workItems: WorkItem[];
  addRequest: (request: Partial<ServiceRequest>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<ServiceRequest>) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus, reviewNote?: string) => Promise<void>;
  addWorkItem: (item: Partial<WorkItem>) => Promise<void>;
  updateWorkItemStatus: (id: string, status: WorkItemStatus) => Promise<void>;
  updateWorkItem: (id: string, updates: Partial<WorkItem>) => Promise<void>;
  addWorkItemNote: (id: string, note: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

  const refreshData = async () => {
    try {
      try {
        const reqRes = await api.get("/requests");
        if (reqRes.data.success) {
          setRequests(reqRes.data.data.requests.map((r: any) => ({ 
            ...r, 
            id: r._id, // Keep original DB ID for API calls
            displayId: r.customId || r._id, // Human-readable ID
            createdBy: r.createdBy?._id || r.createdBy,
            preferredDeadline: r.preferredDeadline ? r.preferredDeadline.split('T')[0] : ""
          })));
        }
      } catch (err: any) {
        if (err?.response?.status !== 403) console.error("Failed to fetch requests", err);
      }
      
      try {
        const wiRes = await api.get("/work-items");
        if (wiRes.data.success) {
          setWorkItems(wiRes.data.data.workItems.map((w: any) => ({ 
            ...w, 
            id: w._id, // Keep original DB ID for API calls
            displayId: w.customId || w._id, // Human-readable ID
            requestId: w.requestId?._id || w.requestId, 
            assigneeId: w.assigneeId?._id || w.assigneeId,
            dueDate: w.dueDate ? w.dueDate.split('T')[0] : "" 
          })));
        }
      } catch (err: any) {
        console.error("Failed to fetch work items", err);
      }
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    }
  };

  useEffect(() => {
    // Re-fetch everything whenever the user session changes (login/logout)
    if (user) {
      refreshData();
    } else {
      setRequests([]);
      setWorkItems([]);
    }
  }, [user]);

  const addRequest = async (newReq: Partial<ServiceRequest>) => {
    try {
      await api.post("/requests", newReq);
      await refreshData();
    } catch(err) { console.error(err); }
  };

  const updateRequest = async (id: string, updates: Partial<ServiceRequest>) => {
    try {
      await api.put(`/requests/${id}`, updates);
      await refreshData();
    } catch(err) { console.error(err); }
  };

  const updateRequestStatus = async (id: string, status: RequestStatus, reviewNote?: string) => {
    try {
      await api.patch(`/requests/${id}/status`, { status, reviewNote });
      await refreshData();
    } catch(err) { console.error(err); }
  };

  const addWorkItem = async (newItem: Partial<WorkItem>) => {
    try {
      await api.post("/work-items", newItem);
      await refreshData();
    } catch(err) { console.error(err); }
  };

  const updateWorkItemStatus = async (id: string, status: WorkItemStatus) => {
    try {
      await api.patch(`/work-items/${id}/status`, { status });
      await refreshData();
    } catch(err) { console.error(err); }
  };

  const updateWorkItem = async (id: string, updates: Partial<WorkItem>) => {
    try {
      await api.put(`/work-items/${id}`, updates);
      await refreshData();
    } catch(err) { console.error(err); }
  };

  const addWorkItemNote = async (id: string, note: string) => {
    try {
      await api.post(`/work-items/${id}/notes`, { text: note });
      await refreshData();
    } catch(err) { console.error(err); }
  };

  return (
    <DataContext.Provider value={{ 
      requests, workItems, addRequest, updateRequest, updateRequestStatus, 
      addWorkItem, updateWorkItemStatus, updateWorkItem, addWorkItemNote, refreshData 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
