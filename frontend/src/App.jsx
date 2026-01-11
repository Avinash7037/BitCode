import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { checkAuth } from "./authSlice";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import CollabPage from "./pages/CollabPage";

import Admin from "./pages/Admin";
import AdminPanel from "./components/AdminPanel";
import AdminDelete from "./components/AdminDelete";
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
import AdminUpdate from "./components/AdminUpdate";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";

// ✅ NEW: update list page
import AdminUpdateList from "./pages/AdminUpdateList";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!ranOnce.current) {
      dispatch(checkAuth());
      ranOnce.current = true;
    }
  }, [dispatch]);

  const isAdmin = isAuthenticated && user?.role === "admin";

  return (
    <Routes>
      {/* ---------------- PUBLIC ROUTES ---------------- */}
      <Route
        path="/"
        element={isAuthenticated ? <Homepage /> : <Navigate to="/signup" />}
      />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />

      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
      />

      {/* ---------------- ADMIN ROUTES ---------------- */}
      <Route
        path="/admin"
        element={isAdmin ? <Admin /> : <Navigate to="/" />}
      />

      <Route
        path="/profile"
        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/signup" />}
      />

      <Route
        path="/admin/create"
        element={isAdmin ? <AdminPanel /> : <Navigate to="/" />}
      />

      {/* ✅ REQUIRED: update list page */}
      <Route
        path="/admin/update"
        element={isAdmin ? <AdminUpdateList /> : <Navigate to="/" />}
      />

      {/* ✅ Actual update form */}
      <Route
        path="/admin/update/:problemId"
        element={isAdmin ? <AdminUpdate /> : <Navigate to="/" />}
      />

      <Route
        path="/admin/delete"
        element={isAdmin ? <AdminDelete /> : <Navigate to="/" />}
      />

      <Route
        path="/admin/video"
        element={isAdmin ? <AdminVideo /> : <Navigate to="/" />}
      />

      <Route
        path="/admin/upload/:problemId"
        element={isAdmin ? <AdminUpload /> : <Navigate to="/" />}
      />

      <Route path="/collab/:roomId" element={<CollabPage />} />

      {/* ---------------- USER ROUTES ---------------- */}
      <Route path="/problem/:problemId" element={<ProblemPage />} />

      {/* ---------------- FALLBACK ---------------- */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
