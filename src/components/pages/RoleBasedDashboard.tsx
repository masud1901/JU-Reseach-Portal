import { Navigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import Dashboard from "./dashboard";
import StudentDashboard from "./StudentDashboard";
import ProfessorDashboard from "./ProfessorDashboard";

export default function RoleBasedDashboard() {
  const { user, loading, isAdmin, isProfessor, isStudent } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  if (isProfessor) {
    return <ProfessorDashboard />;
  }

  if (isStudent) {
    return <StudentDashboard />;
  }

  // If no specific role yet, show the general dashboard
  return <Dashboard />;
}