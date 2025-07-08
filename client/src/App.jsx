import React, { useEffect, useState } from "react";

// Updated total problems based on LeetCode
const TOTAL_EASY_PROBLEMS = 885;
const TOTAL_MEDIUM_PROBLEMS = 1878;
const TOTAL_HARD_PROBLEMS = 848;
const TOTAL_ALL_PROBLEMS = TOTAL_EASY_PROBLEMS + TOTAL_MEDIUM_PROBLEMS + TOTAL_HARD_PROBLEMS;
const TOTAL_USERS = 20000000;

// Simple SVG pie chart (just proportions)
function ProblemRatioCircle({ easy, medium, hard }) {
  const total = easy + medium + hard;
  const easyPercent = (easy / total) * 100;
  const mediumPercent = (medium / total) * 100;
  const hardPercent = 100 - easyPercent - mediumPercent;

  const easyDeg = (easyPercent / 100) * 360;
  const mediumDeg = (mediumPercent / 100) * 360;
  const hardDeg = 360 - easyDeg - mediumDeg;

  return (
    <svg viewBox="0 0 36 36" className="w-14 h-14">
      <circle cx="18" cy="18" r="16" fill="#1F2937" />
      <circle
        r="16"
        cx="18"
        cy="18"
        fill="transparent"
        stroke="#22c55e"
        strokeWidth="4"
        strokeDasharray={`${easyDeg} ${360 - easyDeg}`}
        transform="rotate(-90 18 18)"
      />
      <circle
        r="16"
        cx="18"
        cy="18"
        fill="transparent"
        stroke="#facc15"
        strokeWidth="4"
        strokeDasharray={`${mediumDeg} ${360 - mediumDeg}`}
        transform={`rotate(${easyDeg - 90} 18 18)`}
      />
      <circle
        r="16"
        cx="18"
        cy="18"
        fill="transparent"
        stroke="#ef4444"
        strokeWidth="4"
        strokeDasharray={`${hardDeg} ${360 - hardDeg}`}
        transform={`rotate(${easyDeg + mediumDeg - 90} 18 18)`}
      />
    </svg>
  );
}

function ProblemProgressBar({ label, solved, total, colorClass }) {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div className="flex items-center text-sm">
      <span className={`w-14 text-right pr-2 ${colorClass} font-medium`}>{label}</span>
      <div className="flex-1 bg-gray-700 rounded-full h-2.5">
        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="ml-2 w-16 text-left text-gray-300 font-medium">
        {solved} / {total}
      </span>
    </div>
  );
}

function ParticipantCard({ p, idx }) {
  const rankStr = p.worldwideRank ? `#${p.worldwideRank.toLocaleString()}` : "N/A";
  const cardBorderColor = idx === 0 ? 'border-yellow-500' : idx === 1 ? 'border-gray-400' : idx === 2 ? 'border-amber-600' : 'border-gray-700';
  const rankTextColor = idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-500' : 'text-gray-500';
  const rankBgColor = idx <= 2 ? 'bg-yellow-900/20' : 'bg-transparent';

  return (
    <a
      href={p.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-gradient-to-br from-[#1A1A1A] to-[#111] border ${cardBorderColor} rounded-xl px-6 py-5 flex flex-col sm:flex-row items-center gap-6 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out`}
    >
      <div className={`flex items-center justify-center w-full sm:w-16 ${rankBgColor} rounded-lg py-2`}>
        <div className={`text-2xl font-bold ${rankTextColor}`}>{idx + 1}</div>
      </div>

      <img
        src={`https://leetcode.com/u/${p.username}/avatar.png`}
        alt="avatar"
        className="w-20 h-20 rounded-full border-2 border-yellow-500 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/333/FFF?text=${p.username.charAt(0).toUpperCase()}`; }}
      />

      <div className="flex-1 text-center sm:text-left">
        <div className="text-yellow-400 font-semibold text-xl mb-1">@{p.username}</div>
        <div className="text-sm text-white mb-3">
          Rank: {rankStr} / {TOTAL_USERS.toLocaleString()}<br />
          Total Solved: {p.problemsSolved ?? "N/A"}
        </div>

        <div className="space-y-1">
          <ProblemProgressBar label="Easy" solved={p.easySolved} total={TOTAL_EASY_PROBLEMS} colorClass="bg-green-500" />
          <ProblemProgressBar label="Medium" solved={p.mediumSolved} total={TOTAL_MEDIUM_PROBLEMS} colorClass="bg-yellow-500" />
          <ProblemProgressBar label="Hard" solved={p.hardSolved} total={TOTAL_HARD_PROBLEMS} colorClass="bg-red-500" />
        </div>
      </div>

      <div className="hidden sm:block">
        <ProblemRatioCircle easy={p.easySolved} medium={p.mediumSolved} hard={p.hardSolved} />
      </div>
    </a>
  );
}

export default function App() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/participants");
        if (!res.ok) throw new Error("HTTP Error: " + res.status);
        const data = await res.json();
        const sorted = [...data].sort((a, b) => (a.worldwideRank || Infinity) - (b.worldwideRank || Infinity));
        setParticipants(sorted);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Check backend server.");
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-2xl text-yellow-300 animate-pulse">Loading leaderboard…</div>;
  if (error) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-400 text-center mb-8 border-b-2 border-yellow-600 pb-4">LeetBoard</h1>
      <div className="space-y-6 max-w-5xl mx-auto">
        {participants.length > 0 ? (
          participants.map((p, idx) => <ParticipantCard key={p.username} p={p} idx={idx} />)
        ) : (
          <p className="text-center text-gray-400">No participant data available.</p>
        )}
      </div>
    </div>
  );
}
