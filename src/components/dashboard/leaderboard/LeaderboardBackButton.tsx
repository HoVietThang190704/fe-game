'use client';
import React from 'react';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const LeaderboardBackButton: React.FC = () => {
  const router = useRouter();
  return (
    <button
      className="absolute top-4 left-4 flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-gradient-to-b from-[#11213a] to-[#18314f] px-5 py-2.5 text-base font-bold text-cyan-200 transition-all hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:border-cyan-400/60"
      onClick={() => router.push('/dashboard')}
    >
      <ArrowLeft className="h-5 w-5 text-cyan-300" />
      <span>Quay lại</span>
    </button>
  );
};

export default LeaderboardBackButton;
