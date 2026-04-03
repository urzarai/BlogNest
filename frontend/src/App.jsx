import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";

// Pages
import Home        from "./pages/Home";
import Blogs       from "./pages/Blogs";
import SingleBlog  from "./pages/SingleBlog";
import Creators    from "./pages/Creators";
import Contact     from "./pages/Contact";
import Login       from "./pages/Login";
import Register    from "./pages/Register";
import CreateBlog  from "./pages/CreateBlog";
import UpdateBlog  from "./pages/UpdateBlog";
import MyBlogs     from "./pages/MyBlogs";

// ── Guards ────────────────────────────────────────────────────────────────────

// Must be logged in
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

// Must be Admin
function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

// Already logged in → redirect away from auth pages
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return !user ? children : <Navigate to="/" replace />;
}

// ── Router ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"            element={<Layout><Home /></Layout>} />
      <Route path="/blogs"       element={<Layout><Blogs /></Layout>} />
      <Route path="/blog/:id"    element={<Layout><SingleBlog /></Layout>} />
      <Route path="/creators"    element={<Layout><Creators /></Layout>} />

      {/* Logged-in users (User + Admin) */}
      <Route path="/contact" element={
        <ProtectedRoute>
          <Layout><Contact /></Layout>
        </ProtectedRoute>
      } />

      {/* Admin only */}
      <Route path="/create-blog" element={
        <AdminRoute>
          <Layout><CreateBlog /></Layout>
        </AdminRoute>
      } />
      <Route path="/update-blog" element={
        <AdminRoute>
          <Layout><UpdateBlog /></Layout>
        </AdminRoute>
      } />
      <Route path="/update-blog/:id" element={
        <AdminRoute>
          <Layout><UpdateBlog /></Layout>
        </AdminRoute>
      } />
      <Route path="/my-blogs" element={
        <AdminRoute>
          <Layout><MyBlogs /></Layout>
        </AdminRoute>
      } />

      {/* Auth pages (redirect if already logged in) */}
      <Route path="/login" element={
        <GuestRoute><Login /></GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute><Register /></GuestRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}