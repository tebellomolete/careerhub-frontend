import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardState {
  view: 'table' | 'grid';
  showClosedJobs: boolean;
  setView: (view: 'table' | 'grid') => void;
  setShowClosedJobs: (show: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      view: 'table',
      showClosedJobs: true,
      setView: (view) => set({ view }),
      setShowClosedJobs: (showClosedJobs) => set({ showClosedJobs }),
    }),
    {
      name: 'careerhub-dashboard-prefs',
    }
  )
);
