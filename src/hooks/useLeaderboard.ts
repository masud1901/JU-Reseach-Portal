import { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";

export interface LeaderboardEntry {
  id: string;
  name: string;
  role: "professor" | "student";
  department: string;
  department_id: string;
  is_verified: boolean;
  points: number;
}

export function useLeaderboard(limit: number = 50) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [limit]);

  async function fetchLeaderboardData() {
    try {
      setLoading(true);
      setError(null);

      // Use the combined leaderboard function
      const { data, error } = await supabase.rpc("get_combined_leaderboard", {
        limit_count: limit,
      });

      if (error) {
        console.error("Error using RPC function:", error);
        // Fallback to separate queries
        await fetchSeparateLeaderboardData();
      } else if (data) {
        // Transform the data to match the expected format
        const transformedData = data.map((entry) => ({
          id: entry.id,
          name: entry.name,
          role: entry.role as "professor" | "student",
          department: entry.department_name || "",
          department_id: entry.department_id,
          is_verified: entry.is_verified,
          points: entry.ranking_points || 0,
        }));
        setLeaderboardData(transformedData);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch leaderboard data");
      console.error("Error fetching leaderboard data:", error);
      // Fallback to separate queries
      await fetchSeparateLeaderboardData();
    } finally {
      setLoading(false);
    }
  }

  async function fetchSeparateLeaderboardData() {
    try {
      // Fetch professors
      const { data: professorData, error: professorError } = await supabase
        .from("professors")
        .select(
          "id, name, department_id, departments(name), is_verified, ranking_points",
        )
        .order("ranking_points", { ascending: false })
        .limit(Math.ceil(limit / 2));

      if (professorError) throw professorError;

      // Fetch students
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("id, name, department_id, departments(name), ranking_points")
        .order("ranking_points", { ascending: false })
        .limit(Math.ceil(limit / 2));

      if (studentError) throw studentError;

      // Transform and combine the data
      const professors = professorData.map((prof) => ({
        id: prof.id,
        name: prof.name,
        role: "professor" as const,
        department: prof.departments?.name || "",
        department_id: prof.department_id,
        is_verified: prof.is_verified,
        points: prof.ranking_points || 0,
      }));

      const students = studentData.map((student) => ({
        id: student.id,
        name: student.name,
        role: "student" as const,
        department: student.departments?.name || "",
        department_id: student.department_id,
        is_verified: false,
        points: student.ranking_points || 0,
      }));

      // Combine and sort by points
      const combined = [...professors, ...students].sort(
        (a, b) => b.points - a.points,
      );
      setLeaderboardData(combined);
    } catch (error: any) {
      setError(error.message || "Failed to fetch separate leaderboard data");
      console.error("Error fetching separate leaderboard data:", error);
      setLeaderboardData([]);
    }
  }

  return { leaderboardData, loading, error, refetch: fetchLeaderboardData };
}
