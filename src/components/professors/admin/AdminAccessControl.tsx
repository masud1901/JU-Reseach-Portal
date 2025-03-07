import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AdminAccessControl({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    checkAdminAccess();
  }, [user, navigate]);

  async function checkAdminAccess() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", user?.email)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin access:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Checking admin access...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin dashboard. This area
            is restricted to authorized administrators only.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
