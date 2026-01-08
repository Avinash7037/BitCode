import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { checkAuth } from "./authSlice";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import AdminPanel from "./components/AdminPanel";
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import ProblemPage from "./pages/ProblemPage";

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

  return (
    <Routes>
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

      <Route
        path="/admin"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <Admin />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/create"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminPanel />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/delete"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminDelete />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/video"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminVideo />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/upload/:problemId"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminUpload />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route path="/problem/:problemId" element={<ProblemPage />} />
    </Routes>
  );
}

export default App;
