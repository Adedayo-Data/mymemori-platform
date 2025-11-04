import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Booking from "./pages/Booking";
import Details from "./pages/Details";
import Visit from "./pages/Visit";
import Gallery from "./pages/Gallery";
import Verification from "./pages/Verification";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
import { EventProvider } from "./context/eventContext";

const App = () => {
  return (
    <>
      <AuthProvider>
        <EventProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/details" element={<Details />} />
            <Route path="/visit/:slug" element={<Visit />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </EventProvider>
      </AuthProvider>
    </>
  );
};

export default App;
