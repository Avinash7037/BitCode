import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosClient.get("/user/profile").then((res) => setProfile(res.data));
    axiosClient.get("/user/stats").then((res) => setStats(res.data));
  }, []);

  if (!profile || !stats) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex justify-center items-center text-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const totalSolved = stats.easy + stats.medium + stats.hard;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT PROFILE CARD */}
        <div className="bg-[#020617] rounded-xl p-6 border border-gray-700">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold">
              {profile.firstName[0]}
            </div>

            <h2 className="mt-4 text-xl font-semibold">
              {profile.firstName} {profile.lastName || ""}
            </h2>
            <p className="text-gray-400 text-sm">{profile.emailId}</p>

            <span className="mt-3 px-3 py-1 bg-indigo-500/20 rounded-full text-xs">
              {profile.role.toUpperCase()}
            </span>

            <p className="text-gray-400 text-sm mt-3">
              Joined {new Date(profile.createdAt).toDateString()}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-3 space-y-6">
          {/* SOLVED STATS */}
          <div className="bg-[#020617] rounded-xl p-6 border border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col justify-center">
              <p className="text-gray-400">Problems Solved</p>
              <h1 className="text-4xl font-bold mt-1">{totalSolved}</h1>
              <p className="text-gray-400 text-sm mt-1">
                Accuracy {stats.accuracy}%
              </p>
            </div>

            <div className="flex justify-center items-center">
              <div className="relative w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="absolute text-2xl font-bold">{totalSolved}</div>
              </div>
            </div>

            <div className="space-y-3">
              <DifficultyRow
                label="Easy"
                value={stats.easy}
                color="bg-green-500"
              />
              <DifficultyRow
                label="Medium"
                value={stats.medium}
                color="bg-yellow-500"
              />
              <DifficultyRow
                label="Hard"
                value={stats.hard}
                color="bg-red-500"
              />
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className="bg-[#020617] rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Performance</h2>
            <div className="bg-gray-700 h-4 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                style={{ width: `${stats.accuracy}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Accuracy: <span className="text-white">{stats.accuracy}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DifficultyRow({ label, value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <p className="flex-1 text-gray-300">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

export default ProfilePage;
