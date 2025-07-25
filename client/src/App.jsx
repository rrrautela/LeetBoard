import React, { useEffect, useState } from "react";

// Constants
const TOTAL_USERS = 20000000;
const TOTAL_EASY_PROBLEMS = 900;
const TOTAL_MEDIUM_PROBLEMS = 1800;
const TOTAL_HARD_PROBLEMS = 700;
const TOTAL_ALL_PROBLEMS = TOTAL_EASY_PROBLEMS + TOTAL_MEDIUM_PROBLEMS + TOTAL_HARD_PROBLEMS;

const MedalIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-medal ${className}`}
  >
    <path d="M12 18.3a3 3 0 1 0 0 5.4 3 3 0 1 0 0-5.4Z" />
    <path d="M10.8 1.7a2 2 0 0 0-2 2v3.9c0 .7.2 1.4.6 2l2.7 3.6c.3.4.8.7 1.3.7h.6c.5 0 1-.3 1.3-.7l2.7-3.6c.4-.6.6-1.3.6-2V3.7a2 2 0 0 0-2-2.1c-.9-.3-1.9-.3-2.8 0h-.2c-.9.3-1.9.3-2.8 0Z" />
    <path d="M11.2 2c.2-.6.9-1 1.6-1s1.4.4 1.6 1" />
    <path d="M12 10v8" />
  </svg>
);

// User Icon
const UserIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`lucide lucide-user ${className}`}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Globe Icon
const GlobeIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`lucide lucide-globe ${className}`}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

// Progress Circle Component
function ProblemStatCircle({ label, solved, total, strokeColor }) {
  const radius = 28;
  const stroke = 6;
  const percentage = Math.max(0, Math.min(solved ?? 0, total)) / total;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage);

  return (
    <div className="flex flex-col items-center flex-shrink-0 select-none">
      <svg width={2 * (radius + stroke)} height={2 * (radius + stroke)}>
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke="#23272f"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke={strokeColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(.4,2,.6,1)" }}
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          fontSize="1.1em"
          fill={strokeColor}
          fontWeight="bold"
          fontFamily="Inter, sans-serif"
          alignmentBaseline="middle"
        >
          {solved}
        </text>
        <text
          x="50%"
          y="66%"
          textAnchor="middle"
          fontSize="0.7em"
          fill="#aaa"
          fontFamily="Inter, sans-serif"
        >
          /{total}
        </text>
      </svg>
      <span className="mt-1 text-xs font-medium" style={{ color: strokeColor }}>
        {label}
      </span>
    </div>
  );
}

// Participant Card Component
function ParticipantCard({ p, idx }) {
  const rankStr = p.worldwideRank ? `#${p.worldwideRank.toLocaleString()}` : "";
  const totalUsersStr = TOTAL_USERS.toLocaleString();

  const isTop1 = idx === 0;
  const isTop2 = idx === 1;
  const isTop3 = idx === 2;

  const cardBorderColor = isTop1
    ? "border-yellow-500"
    : isTop2
    ? "border-gray-400"
    : isTop3
    ? "border-amber-600"
    : "border-gray-700";
  const rankTextColor = isTop1
    ? "text-yellow-400"
    : isTop2
    ? "text-gray-300"
    : isTop3
    ? "text-amber-500"
    : "text-gray-500";
  const rankBgColor = isTop1
    ? "bg-yellow-900/20"
    : isTop2
    ? "bg-gray-700/20"
    : isTop3
    ? "bg-amber-800/20"
    : "bg-transparent";

  return (
    <a
      href={p.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-gradient-to-br from-[#1A1A1A] to-[#111] border ${cardBorderColor} rounded-xl px-4 py-3 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-5 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out cursor-pointer`}
    >
      {/* Rank Display */}
      <div className={`flex items-center justify-center w-full sm:w-16 flex-shrink-0 ${rankBgColor} rounded-lg py-2 sm:py-0`}>
        {isTop1 || isTop2 || isTop3 ? (
          <MedalIcon className={`w-8 h-8 ${rankTextColor}`} />
        ) : (
          <div className={`text-2xl font-extrabold ${rankTextColor}`}>{idx + 1}</div>
        )}
      </div>

      {/* Avatar */}
      <img
        src={`https://leetcode.com/u/${p.username}/avatar.png`}
        alt="profile avatar"
        className="w-16 h-16 rounded-full border-2 border-yellow-500 flex-shrink-0 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/64x64/333/FFF?text=${p.username.charAt(0).toUpperCase()}`;
        }}
      />

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <div className="text-yellow-400 font-semibold text-xl flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-blue-400" />
          @{p.username}
        </div>
        <div className="text-sm text-gray-300 mt-2 flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1">
          <span className="text-white font-semibold flex items-center gap-1">
            <GlobeIcon className="w-4 h-4 text-purple-400" />
            Rank: {rankStr} {p.worldwideRank ? `/ ${totalUsersStr}` : ""}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center sm:justify-end items-center gap-6 mt-4 sm:mt-0 flex-wrap">
        <ProblemStatCircle label="Easy" solved={p.easySolved} total={TOTAL_EASY_PROBLEMS} strokeColor="#22c55e" />
        <ProblemStatCircle label="Medium" solved={p.mediumSolved} total={TOTAL_MEDIUM_PROBLEMS} strokeColor="#eab308" />
        <ProblemStatCircle label="Hard" solved={p.hardSolved} total={TOTAL_HARD_PROBLEMS} strokeColor="#ef4444" />
        <ProblemStatCircle label="Total" solved={p.problemsSolved} total={TOTAL_ALL_PROBLEMS} strokeColor="#3b82f6" />
      </div>
    </a>
  );
}

// Final Main App Component
export default function App() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://leetboard-kny4.onrender.com/api/participants"; // Your backend URL

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const sorted = [...data].sort((a, b) => (a.worldwideRank || Infinity) - (b.worldwideRank || Infinity));
        setParticipants(sorted);
      } catch (err) {
        console.error("Failed to fetch participants:", err);
        setError("Failed to load leaderboard data. Please check backend availability.");
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-yellow-300 flex items-center justify-center text-2xl font-semibold animate-pulse">
        Loading leaderboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <div className="text-xl text-red-500 text-center p-6 border border-red-700 rounded-lg bg-gray-800 shadow-lg">
          <p className="mb-2 font-bold">Error Loading Data!</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 font-inter">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-400 text-center mb-8 pb-4 border-b-2 border-yellow-600">
        <MedalIcon className="inline-block w-10 h-10 mr-3 text-yellow-500" />
        LeetBoard
      </h1>
      <div className="space-y-4 max-w-4xl mx-auto">
        {participants.length > 0 ? (
          participants.map((p, idx) => (
            <ParticipantCard key={p.username} p={p} idx={idx} />
          ))
        ) : (
          <p className="text-center text-gray-400 text-lg mt-10">No participant data available.</p>
        )}
      </div>
    </div>
  );
}
