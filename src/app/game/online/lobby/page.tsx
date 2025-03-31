"use client";

import { useSession } from "next-auth/react";

export default function LobbyPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          リバーシ オンライン
        </h2>
        <div className="text-center">
          {session ? (
            <p className="text-lg">ログイン中: {session.user?.email}</p>
          ) : (
            <p className="text-lg">未ログイン</p>
          )}
        </div>
      </div>
    </div>
  );
}
