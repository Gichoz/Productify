import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePage from "./pages/CreatePage";
import EditProductPage from "./pages/EditProductPage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";

function App() {
  const { isClerkLoaded } = useAuthReq();
  useUserSync();

  if (!isClerkLoaded) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <>
                <SignedIn>
                  <ProfilePage />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/create"
            element={
              <>
                <SignedIn>
                  <CreatePage />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <>
                <SignedIn>
                  <EditProductPage />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;