'use client';

import { useEffect, useState } from 'react';

import LeaderboardBackButton from '@/components/dashboard/leaderboard/LeaderboardBackButton';
import LeaderboardTop3 from '@/components/dashboard/leaderboard/LeaderboardTop3';
import LeaderboardTable from '@/components/dashboard/leaderboard/LeaderboardTable';
import LeaderboardUserBar from '@/components/dashboard/leaderboard/LeaderboardUserBar';
import { fetchLeaderboard, mapLeaderboardToPlayers } from '@/lib/api/leaderboard';
import { Player } from '@/components/dashboard/leaderboard/Leaderboard.types';

const LeaderboardPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy token động từ localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') || undefined : undefined;
        const res = await fetchLeaderboard(token);
        // Nếu backend trả về userId hiện tại, có thể lấy từ token hoặc context
        const userId = undefined;
        const mapped = mapLeaderboardToPlayers(res.data, userId);
        setPlayers(mapped);
        // Tìm user hiện tại nếu có
        setCurrentUser(mapped.find((p) => p.isCurrentUser) || mapped[0] || null);
      } catch (e: any) {
        setError(e.message || 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-cyan-200 text-center py-10">Đang tải bảng xếp hạng...</div>;
  if (error) return <div className="text-red-400 text-center py-10">{error}</div>;
  if (!players.length) return <div className="text-cyan-200 text-center py-10">Không có dữ liệu bảng xếp hạng.</div>;

  // Nếu backend trả về userPosition, có thể dùng để highlight
  const userRank = currentUser?.rank || 0;


  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] pb-24">
      <LeaderboardBackButton />
      <div className="max-w-3xl mx-auto pt-8 px-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-cyan-300 mb-1 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] uppercase">
            Bảng xếp hạng
          </h1>
          <div className="text-cyan-100 text-sm opacity-80">Top những người chơi xuất sắc nhất</div>
        </div>
        <LeaderboardTop3 players={players.slice(0, 3)} />
        {/* Chỉ truyền top 4-10 vào bảng danh sách */}
        <LeaderboardTable players={players.slice(3, 10)} currentUserRank={userRank} />
      </div>
      {currentUser && (
        <LeaderboardUserBar
          rank={currentUser.rank}
          onProfileClick={() => {
            window.location.href = '/dashboard/myprofile';
          }}
        />
      )}
    </div>
  );
};

export default LeaderboardPage;