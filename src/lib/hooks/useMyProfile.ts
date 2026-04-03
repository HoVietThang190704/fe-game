import { useEffect, useState } from "react";
import { getUserProfile } from "../api/user";

export interface MyProfile {
  username: string;
  name: string;
  rank: number;
  avatar_url?: string;
  joinDate: string;
  wins?: number;
  losses?: number;
  totalMatches?: number;
  winRate?: number;
}

export function useMyProfile(): {
  profile: MyProfile | null;
  loading: boolean;
  error: string | null;
} {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const data = await getUserProfile(
          "username,name,rank,avatar_url,createdAt,wins,losses,totalMatches,winRate",
        );

        let joinDate = "N/A";
        const raw = (data as Record<string, unknown>).createdAt as
          | string
          | undefined;
        if (raw) {
          const d = new Date(raw);
          if (!isNaN(d.getTime())) {
            joinDate = d.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          }
        }

        setProfile({
          username: data.username ?? "Unknown",
          name: data.name ?? data.username ?? "Unknown",
          rank: data.rank ?? 1000,
          avatar_url: data.avatar_url,
          joinDate,
          wins: (data as Record<string, unknown>).wins as number | undefined,
          losses: (data as Record<string, unknown>).losses as number | undefined,
          totalMatches: (data as Record<string, unknown>).totalMatches as number | undefined,
          winRate: (data as Record<string, unknown>).winRate as number | undefined,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
