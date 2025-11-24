import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-linear-to-br from-pink-50 via-rose-50 to-orange-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Floating hearts decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart
          className="absolute top-20 left-20 w-8 h-8 text-pink-300 fill-pink-300 opacity-40 animate-bounce"
          style={{ animationDuration: "3s" }}
        />
        <Heart
          className="absolute top-40 right-32 w-6 h-6 text-rose-300 fill-rose-300 opacity-30 animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        />
        <Heart
          className="absolute bottom-32 left-40 w-10 h-10 text-pink-200 fill-pink-200 opacity-25 animate-bounce"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />
        <Sparkles className="absolute top-1/3 right-20 w-8 h-8 text-orange-300 opacity-40 animate-pulse" />
        <Sparkles
          className="absolute bottom-40 right-1/4 w-6 h-6 text-rose-300 opacity-30 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <span className="text-2xl font-black bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
              MyMemori
            </span>
          </div>

          <button
            onClick={handleGetStarted}
            className="px-8 py-2.5 bg-white text-pink-600 rounded-full font-semibold text-sm hover:shadow-lg transition-all border border-pink-200 hover:border-pink-300 hover:scale-105 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 h-[calc(100vh-88px)] flex items-center justify-center px-6 ">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
            <span className="bg-linear-to-r from-pink-600 via-rose-600 to-orange-500 bg-clip-text text-transparent">
              Share Memories,
            </span>
            <br />
            <span className="text-gray-900">Celebrate Together</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Create a beautiful digital space for your wedding, birthday, or
            special event. Let your guests share photos and memories in one
            magical place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-bold text-base shadow-xl shadow-pink-200/50 hover:shadow-2xl hover:shadow-pink-300/50 transition-all flex items-center gap-2 hover:gap-3 hover:scale-105 cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 transition-all" />
            </button>

            {/* <button
              onClick={handleLearnMore}
              className="px-8 py-4 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 rounded-full font-bold text-base border-2 border-gray-300 hover:border-pink-400 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              See How It Works
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
