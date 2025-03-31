"use client";
import { useState, useEffect } from "react";

import io from "socket.io-client";
import { useSearchParams } from "next/navigation";

const getSessionId = () => {
  // セッションIDを生成して保存
  const newSessionId = Math.random().toString(36).substring(2, 15);
  return newSessionId;
};

// URLクエリパラメータからroomIdを取得する
const useRoomId = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  return roomId;
};

export default function Room() {
  const [message, setMessage] = useState("");
  const [list, setList] = useState<{ id: number; message: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // セッションIDを生成
  const sessionId = getSessionId();
  console.log("sessionId", sessionId);
  // roomIdを取得
  const roomId = useRoomId();
  console.log("roomId", roomId);
  // sessionIdをクエリパラメータとして渡す（一つのブラウザから何回も接続しないように判定するため）
  const socket = io("http://localhost:8000", {
    query: { sessionId: sessionId, roomId: roomId },
  });

  useEffect(() => {
    
    // 接続エラー時の処理
    socket.on("connect_error", () => {
      setError("接続エラーが発生しました。");
    });

    // 接続拒否時の処理
    socket.on("session_id_duplicate", () => {
      setError("既に同じセッションからの接続があります。");
    });

    // 正常接続時の処理
    socket.on("connect", () => {
      setConnected(true);
      setError(null);
    });

    // クリーンアップ
    return () => {
      socket.off("connect_error");
      socket.off("session_id_duplicate");
      socket.off("connect");
    };
  }, []);

  // メッセージ受信の処理
  useEffect(() => {
    const handleReceivedMessage = (data: { message: string }) => {
      setList((prevList) => [
        ...prevList,
        { id: Date.now(), message: data.message },
      ]);
    };

    socket.on("received_message", handleReceivedMessage);

    return () => {
      socket.off("received_message", handleReceivedMessage);
    };
  }, []);

  const handleSendMessage = () => {
    if (!connected) return;
    //サーバーへ送信
    socket.emit("send_message", { message: message });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* チャット表示 */}
        {list.map((chat) => (
          <div key={chat.id}>{chat.message}</div>
        ))}

        {/* チャット送信 */}
        <input
          type="text"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="入力欄"
          value={message}
          disabled={!connected}
        />
        <button
          onClick={() => {
            handleSendMessage();
            setMessage("");
          }}
          disabled={!connected}
        >
          チャット送信
        </button>
      </main>
    </div>
  );
}
