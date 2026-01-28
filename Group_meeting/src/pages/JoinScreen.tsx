import { useState } from "react";
import { Video, Mic, ArrowRight } from "lucide-react";

export const JoinScreen = ({ onJoin }: { onJoin: (token: string) => void }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://cortez-dineric-superurgently.ngrok-free.dev/getToken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: room,
            participantName: name,
          }),
        }
      );
      console.log("response", res);
      const data = await res.json();
      // console.log("dfa"+data)
      console.log("JOIN TOKEN", data.token);
     
      onJoin(data.token);
      console.log("room id",data.roomId);
    } catch {
      alert("Failed to join server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center p-4
      bg-neutral-100 relative overflow-hidden"
      style={{
        // ✅ GRID ALWAYS VISIBLE
        backgroundImage: `
          linear-gradient(
            to right,
            rgba(0,0,0,0.15) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.15) 1px,
            transparent 1px
          )
        `,
        backgroundSize: "80px 80px",
        animation: "gridMove 5s linear infinite",
      }}
    >
      {/* ================= CARD ================= */}
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-3 text-blue-500 mb-4">
            <Video size={40} /> <Mic size={40} />
          </div>

          <h1 className="text-4xl font-bold text-neutral-900">
            AI Video Chat
          </h1>
          <p className="text-neutral-600">
            Real-time translation & Smart Layouts
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-8 rounded-2xl
          bg-white border border-neutral-200 shadow-xl"
        >
          <div>
            <label className="text-xs uppercase font-semibold text-neutral-600">
              Your Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg
              bg-neutral-100 text-neutral-900
              border border-neutral-300
              focus:ring-2 ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-semibold text-neutral-600">
              Room Name
            </label>
            <input
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg
              bg-neutral-100 text-neutral-900
              border border-neutral-300
              focus:ring-2 ring-blue-500 outline-none"
            />
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800
            text-white py-3 rounded-lg font-bold
            flex items-center justify-center gap-2
            transition-all disabled:opacity-70"
          >
            {isLoading ? (
              "Connecting..."
            ) : (
              <>
                Join Meeting <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* ================= GRID ANIMATION ================= */}
      <style jsx global>{`
        @keyframes gridMove {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 40px 40px, 40px 40px;
          }
        }
      `}</style>
    </div>
  );
};
