import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider, useAuth } from "../supabase/auth";
import DebugSupabase from "./components/DebugSupabase";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import MainLayout from "./components/layout/MainLayout";
import DatabaseExplorer from "./components/pages/DatabaseExplorer";
import HowItWorksDetailed from "./components/pages/HowItWorksDetailed";
import Dashboard from "./components/pages/dashboard.tsx";
import Home from "./components/pages/home";
import Success from "./components/pages/success";
import ConnectionRequests from "./components/professors/ConnectionRequests";
import LeaderboardPage from "./components/professors/LeaderboardPage";
import ProfessorForm from "./components/professors/ProfessorForm";
import ProfessorList from "./components/professors/ProfessorList";
import StudentForm from "./components/professors/StudentForm";
import StudentList from "./components/professors/StudentList";
import AdminDashboard from "./components/professors/admin/AdminDashboard";
import FallbackProfileDetail from "./components/profiles/FallbackProfileDetail";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <LoginForm />
            </MainLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <MainLayout>
              <SignUpForm />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/success"
          element={
            <MainLayout>
              <Success />
            </MainLayout>
          }
        />
        <Route
          path="/professors"
          element={
            <MainLayout>
              <ProfessorList />
            </MainLayout>
          }
        />
        <Route
          path="/professors/:id"
          element={
            <MainLayout>
              <FallbackProfileDetail />
            </MainLayout>
          }
        />
        <Route
          path="/create-professor-profile"
          element={
            <MainLayout>
              <ProfessorForm />
            </MainLayout>
          }
        />
        <Route
          path="/create-student-profile"
          element={
            <MainLayout>
              <StudentForm />
            </MainLayout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <MainLayout>
              <LeaderboardPage />
            </MainLayout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <MainLayout>
              <HowItWorksDetailed />
            </MainLayout>
          }
        />
        <Route
          path="/students"
          element={
            <MainLayout>
              <StudentList />
            </MainLayout>
          }
        />
        <Route
          path="/students/:id"
          element={
            <MainLayout>
              <FallbackProfileDetail />
            </MainLayout>
          }
        />
        <Route
          path="/connections"
          element={
            <PrivateRoute>
              <MainLayout>
                <ConnectionRequests />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/database-explorer"
          element={
            <PrivateRoute>
              <MainLayout>
                <DatabaseExplorer />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route path="/debug-supabase" element={<DebugSupabase />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <AppRoutes />
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
