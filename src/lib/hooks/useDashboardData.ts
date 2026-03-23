import { useEffect, useState } from "react";
import { dashboardInitialState } from "@/src/components/dashboard/dashboard-data";
import type { DashboardState } from "@/src/components/dashboard/dashboard.types";

export function useDashboardData(): { data: DashboardState | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // TODO: Read from backend API and remove mock data
        await new Promise((resolve) => setTimeout(resolve, 250));
        setData(dashboardInitialState);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Dashboard load failed");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
