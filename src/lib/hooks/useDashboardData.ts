import { useEffect, useState } from "react";
import { dashboardInitialState } from "@/src/components/dashboard/dashboard-data";
import type { DashboardState } from "@/src/components/dashboard/dashboard.types";
import { getUserProfile } from "../api/user";

export function useDashboardData(): {
  data: DashboardState | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const userProfile = await getUserProfile(
          "username,name,rank,wins,losses,totalMatches,winRate,avatar_url",
        );
        setData({
          ...dashboardInitialState,
          player: {
            username: userProfile.username,
            elo: userProfile.rank,
            winRate: userProfile.winRate,
            totalMatches: userProfile.totalMatches,
            wins: userProfile.wins,
            losses: userProfile.losses,
            avatar_url: userProfile.avatar_url,
          },
        });
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
