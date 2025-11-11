import { useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";
import Navigation from "../components/Navigation";
import { Heart } from "lucide-react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";

// Simple placeholder dataset to simulate a Pinterest-like gallery
// label: "L" for liked, "U" for uploads

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"created" | "attended">("created");
  const { getUserDisplayInfo } = useAuth();
  const userInfo = getUserDisplayInfo();
  const navigate = useNavigate();
  const eventsCreated = useMemo<
    Array<{
      id: number;
      title: string;
      date: string;
      slug: string;
      photos: string[];
    }>
  >(
    () => [
      {
        id: 1,
        title: "Olivia & Liam's Wedding",
        date: "Oct 18, 2024",
        slug: "olivia-liam",
        photos: [
          "from-rose-200 to-pink-300",
          "from-amber-100 to-orange-200",
          "from-blue-100 to-sky-200",
        ],
      },
      {
        id: 2,
        title: "The Chen Engagement Party",
        date: "Aug 15, 2024",
        slug: "chen-engagement",
        photos: [
          "from-emerald-200 to-teal-300",
          "from-purple-100 to-violet-200",
          "from-gray-100 to-zinc-200",
        ],
      },
      {
        id: 3,
        title: "Sarah & Michael's Wedding",
        date: "Sep 22, 2024",
        slug: "sarah-michael",
        photos: [
          "from-indigo-200 to-blue-300",
          "from-rose-100 to-pink-200",
          "from-amber-200 to-yellow-300",
        ],
      },
    ],
    []
  );

  const attendedPhotos = useMemo(
    () => [
      {
        id: 1,
        color: "from-pink-100 to-rose-100",
        h: 220,
        likes: 24,
        src: "https://picsum.photos/id/1011/600/800",
      },
      {
        id: 2,
        color: "from-amber-50 to-orange-50",
        h: 280,
        likes: 11,
        src: "https://picsum.photos/id/1012/800/600",
      },
      {
        id: 3,
        color: "from-emerald-50 to-teal-100",
        h: 180,
        likes: 8,
        src: "https://picsum.photos/id/1015/700/700",
      },
      {
        id: 4,
        color: "from-blue-50 to-sky-100",
        h: 260,
        likes: 17,
        src: "https://picsum.photos/id/1024/700/900",
      },
      {
        id: 5,
        color: "from-purple-50 to-violet-100",
        h: 210,
        likes: 5,
        src: "https://picsum.photos/id/1035/800/900",
      },
      {
        id: 6,
        color: "from-slate-100 to-gray-200",
        h: 300,
        likes: 32,
        src: "https://picsum.photos/id/1039/900/700",
      },
      {
        id: 7,
        color: "from-rose-50 to-pink-50",
        h: 190,
        likes: 12,
        src: "https://picsum.photos/id/1040/700/700",
      },
      {
        id: 8,
        color: "from-amber-100 to-yellow-100",
        h: 240,
        likes: 9,
        src: "https://picsum.photos/id/1041/800/700",
      },
      {
        id: 9,
        color: "from-teal-50 to-cyan-100",
        h: 230,
        likes: 21,
        src: "https://picsum.photos/id/1043/700/800",
      },
      {
        id: 10,
        color: "from-rose-200 to-pink-200",
        h: 270,
        likes: 15,
        src: "https://picsum.photos/id/1050/900/900",
      },
      {
        id: 11,
        color: "from-indigo-50 to-blue-100",
        h: 200,
        likes: 4,
        src: "https://picsum.photos/id/1052/700/700",
      },
      {
        id: 12,
        color: "from-zinc-100 to-neutral-200",
        h: 260,
        likes: 6,
        src: "https://picsum.photos/id/1060/800/900",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-rose-50 ">
      <div>
        <Navigation />
        <Link
          to="/profile"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity md:hidden ml-5 pt-5"
        >
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
          <span className="text-xl font-bold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            MyMemori
          </span>
        </Link>
      </div>
      {/* Profile header */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md">
              <span className="text-3xl font-bold text-white">
                {userInfo?.fullname?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userInfo?.fullname || "User"}
              </h1>
              <p className="text-gray-500 text-sm">
                {userInfo?.email || "user@example.com"}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("created")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === "created"
                  ? "bg-white text-pink-600 shadow"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Events Created
            </button>
            <button
              onClick={() => setActiveTab("attended")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === "attended"
                  ? "bg-white text-pink-600 shadow"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Events Attended
            </button>
          </div>
        </div>
      </section>
      {activeTab === "created" && (
        <section className="max-w-7xl mx-auto px-6 py-8">
          {eventsCreated.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mb-3">
                ❤️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No events created yet
              </h3>
              <p className="text-sm text-gray-600">
                Create an event to start collecting memories.
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventsCreated.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="relative h-40 mb-4">
                      <div
                        className={`absolute inset-0 mx-auto w-40 h-40 rounded-xl shadow-md bg-linear-to-br ${ev.photos[0]} z-20`}
                      />
                      <div
                        className={`absolute top-2 left-6 w-36 h-36 rounded-xl shadow bg-linear-to-br ${ev.photos[1]} -rotate-6 -translate-x-4 translate-y-2 z-10`}
                      />
                      <div
                        className={`absolute top-3 right-6 w-36 h-36 rounded-xl shadow bg-linear-to-br ${ev.photos[2]} rotate-6 translate-x-4 z-10`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                        {ev.title}
                      </h3>
                      <p className="text-sm text-gray-500">{ev.date}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => navigate(`/gallery?event=${ev.slug}`)}
                        className="w-full px-4 py-2.5 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 font-medium transition-all"
                      >
                        View Gallery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {activeTab === "attended" && (
        <section className="max-w-7xl mx-auto px-6 py-8">
          {attendedPhotos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mb-3">
                📸
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No photos yet
              </h3>
              <p className="text-sm text-gray-600">
                Photos from events you attend will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({
                  length: Math.ceil(attendedPhotos.length / 3),
                }).map((_, idx) => {
                  const start = idx * 3;
                  const group = attendedPhotos.slice(start, start + 3);
                  return (
                    <button
                      key={idx}
                      onClick={() => navigate(`/gallery`)}
                      className="relative h-40 rounded-2xl overflow-hidden text-left"
                    >
                      <div className="relative h-40 mb-4">
                        <div
                          className={`absolute inset-0 mx-auto w-40 h-40 rounded-xl  bg-linear-to-br ${
                            group[0]?.color || "from-gray-100 to-gray-200"
                          } z-20`}
                        />
                        <div
                          className={`absolute top-2 left-6 w-36 h-36 rounded-xl  bg-linear-to-br ${
                            group[1]?.color || "from-gray-100 to-gray-200"
                          } -rotate-6 -translate-x-4 translate-y-2 z-10`}
                        />
                        <div
                          className={`absolute top-3 right-6 w-36 h-36 rounded-xl  bg-linear-to-br ${
                            group[2]?.color || "from-gray-100 to-gray-200"
                          } rotate-6 translate-x-4 z-10`}
                        />
                      </div>

                      <div className="absolute bottom-2 right-3 px-2 py-1 text-[10px] font-semibold rounded-full bg-white/80 text-pink-600 flex items-center gap-1 z-30">
                        <Heart className="w-3 h-3" />
                        {group.reduce((sum, p) => sum + (p.likes || 0), 0)}
                      </div>
                    </button>
                  );
                })}
              </div>

              <h4 className="mt-10 mb-3 text-sm font-semibold text-gray-700">
                All Photos
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {attendedPhotos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => navigate(`/gallery`)}
                    className={`mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-linear-to-br ${photo.color}`}
                    style={{ height: `${photo.h}px` }}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 text-[10px] font-semibold rounded-full bg-white/80 text-pink-600 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {photo.likes}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <div className="pb-20 md:pb-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default Profile;
