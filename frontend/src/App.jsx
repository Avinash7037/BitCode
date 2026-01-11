import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { checkAuth } from "./authSlice";

// Public Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// User Pages
import Homepage from "./pages/Homepage";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";
import CollabPage from "./pages/CollabPage";

// Admin Pages
import Admin from "./pages/Admin";
import AdminPanel from "./components/AdminPanel";
import AdminDelete from "./components/AdminDelete";
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
import AdminUpdate from "./components/AdminUpdate";
import AdminUpdateList from "./pages/AdminUpdateList";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const ranOnce = useRef(false);

  // 🔐 Check login only once on app load
  useEffect(() => {
    if (!ranOnce.current) {
      dispatch(checkAuth());
      ranOnce.current = true;
    }
  }, [dispatch]);

  const isAdmin = isAuthenticated && user?.role === "admin";

  return (
    <Routes>
      {/* ---------------- LANDING ---------------- */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />}
      />

      {/* ---------------- AUTH ---------------- */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
      />

      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/home" /> : <Signup />}
      />

      {/* ---------------- USER DASHBOARD ---------------- */}
      <Route
        path="/home"
        element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />}
      />

      <Route
        path="/profile"
        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
      />

      <Route
        path="/problem/:problemId"
        element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />}
      />

      <Route
        path="/collab/:roomId"
        element={isAuthenticated ? <CollabPage /> : <Navigate to="/login" />}
      />

      {/* ---------------- ADMIN ---------------- */}
      <Route
        path="/admin"
        element={isAdmin ? <Admin /> : <Navigate to="/home" />}
      />

      <Route
        path="/admin/create"
        element={isAdmin ? <AdminPanel /> : <Navigate to="/home" />}
      />

      <Route
        path="/admin/update"
        element={isAdmin ? <AdminUpdateList /> : <Navigate to="/home" />}
      />

      <Route
        path="/admin/update/:problemId"
        element={isAdmin ? <AdminUpdate /> : <Navigate to="/home" />}
      />

      <Route
        path="/admin/delete"
        element={isAdmin ? <AdminDelete /> : <Navigate to="/home" />}
      />

      <Route
        path="/admin/video"
        element={isAdmin ? <AdminVideo /> : <Navigate to="/home" />}
      />

      <Route
        path="/admin/upload/:problemId"
        element={isAdmin ? <AdminUpload /> : <Navigate to="/home" />}
      />

      {/* ---------------- FALLBACK ---------------- */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
