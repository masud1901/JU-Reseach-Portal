import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import { AuthProvider, useAuth } from "../supabase/auth";
import ProfessorsLayout from "./components/pages/professors";
import ProfessorList from "./components/professors/ProfessorList";
import ProfessorDetail from "./components/professors/ProfessorDetail";
import ProfessorForm from "./components/professors/ProfessorForm";
import LeaderboardPage from "./components/professors/LeaderboardPage";

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/professors" element={<ProfessorsLayout />}>
          <Route index element={<ProfessorList />} />
          <Route path=":id" element={<ProfessorDetail />} />
        </Route>
        <Route path="/create-profile" element={<ProfessorForm />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
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
    </AuthProvider>
  );
}

export default App;
