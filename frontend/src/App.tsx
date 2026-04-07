import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
import { EventProvider } from "./context/eventContext";
import { PictureProvider } from "./context/pictureContext";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import Layout from "./components/Layout";

// Lazy load all page components
const Landing = lazy(() => import("./pages/Landing"));
const Recruiters = lazy(() => import("./pages/Recruiters"));
const Waitlist = lazy(() => import("./pages/Waitlist"));
const Home2 = lazy(() => import("./pages/NewHome"));
const Auth = lazy(() => import("./pages/Auth"));
const Booking = lazy(() => import("./pages/Booking"));
const EventList = lazy(() => import("./pages/EventList"));
const ShareDetails = lazy(() => import("./pages/ShareDetails"));
const Visit = lazy(() => import("./pages/Visit"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Profile = lazy(() => import("./pages/Profile"));

const App = () => {
  return (
    <>
      <AuthProvider>
        <EventProvider>
          <PictureProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Waitlist />} />
                  <Route path="/recruiters" element={<Recruiters />} />
                  <Route path="/waitlist" element={<Waitlist />} />
                  <Route path="/home" element={<Home2 />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/book" element={<Booking />} />
                  <Route path="/event-list" element={<EventList />} />
                  <Route path="/share-details" element={<ShareDetails />} />
                  <Route path="/visit/:slug" element={<Visit />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </Suspense>
          </PictureProvider>
        </EventProvider>
      </AuthProvider>
    </>
  );
};

export default App;
