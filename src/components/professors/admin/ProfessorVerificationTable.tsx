import { useState, useEffect } from "react";
import { supabase } from "../../../../supabase/supabase";
import { Professor } from "@/types/professor";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../../../supabase/auth";
import { useNavigate } from "react-router-dom";

export default function ProfessorVerificationTable() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // In a real app, you would check if the user is an admin
  // For this demo, we'll assume any logged-in user can access this page
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchProfessors();
  }, [user, navigate]);

  async function fetchProfessors() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("professors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setProfessors(data as Professor[]);
      }
    } catch (error) {
      console.error("Error fetching professors:", error);
    } finally {
      setLoading(false);
    }
  }

  async function verifyProfessor(id: string, verified: boolean) {
    try {
      const { error } = await supabase
        .from("professors")
        .update({ is_verified: verified })
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Update the local state
      setProfessors((prev) =>
        prev.map((prof) =>
          prof.id === id ? { ...prof, is_verified: verified } : prof,
        ),
      );
    } catch (error) {
      console.error("Error updating professor verification:", error);
    }
  }

  const columns: ColumnDef<Professor>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "research_interests",
      header: "Research Interests",
      cell: ({ row }) => {
        const interests = row.original.research_interests;
        return (
          <div className="flex flex-wrap gap-1">
            {interests.slice(0, 2).map((interest, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
            {interests.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{interests.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_verified",
      header: "Status",
      cell: ({ row }) => {
        return row.original.is_verified ? (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </Badge>
        ) : (
          <Badge variant="outline">
            <XCircle className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const professor = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/professors/${professor.id}`)}
            >
              View
            </Button>
            {professor.is_verified ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => verifyProfessor(professor.id, false)}
              >
                Unverify
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => verifyProfessor(professor.id, true)}
              >
                Verify
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center h-64">
        <p>Loading professors...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Professor Verification</h1>
      <DataTable
        columns={columns}
        data={professors}
        searchKey="name"
        searchPlaceholder="Search professors..."
      />
    </div>
  );
}
