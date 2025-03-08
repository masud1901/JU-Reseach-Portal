import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge-dark";
import { Button } from "@/components/ui/button-dark";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-dark";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";

export default function ProfessorDashboard() {
  const [professors, setProfessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  useEffect(() => {
    fetchTopProfessors();
    fetchLeaderboardData();
  }, []);

  async function fetchTopProfessors() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("professors")
        .select("*, departments(name)")
        .order("ranking_points", { ascending: false })
        .limit(3);

      if (error) throw error;

      if (data) {
        // Transform the data to match the expected format
        const transformedData = data.map((prof) => ({
          ...prof,
          department: prof.departments?.name || "",
        }));
        setProfessors(transformedData);
      }
    } catch (error) {
      console.error("Error fetching top professors:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLeaderboardData() {
    try {
      // Try to use the combined leaderboard function
      const { data, error } = await supabase.rpc("get_combined_leaderboard", {
        limit_count: 10,
      });

      if (error) {
        console.error("Error using RPC function:", error);
        // Fallback to professors only
        const { data: profData, error: profError } = await supabase
          .from("professors")
          .select("id, name, departments(name), is_verified, ranking_points")
          .order("ranking_points", { ascending: false })
          .limit(10);

        if (profError) throw profError;

        if (profData) {
          // Transform the data to match the expected format
          const transformedData = profData.map((prof) => ({
            id: prof.id,
            name: prof.name,
            department: prof.departments?.name || "",
            is_verified: prof.is_verified,
            points: prof.ranking_points || 0,
          }));
          setLeaderboardData(transformedData);
        }
      } else if (data) {
        // Transform the data from the RPC function
        const transformedData = data.map((entry) => ({
          id: entry.id,
          name: entry.name,
          department: entry.department_name || "",
          is_verified: entry.is_verified,
          points: entry.ranking_points || 0,
          role: entry.role,
        }));
        setLeaderboardData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  }

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Research Leaderboard</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link to="/professors">
            <Button variant="outline" size="sm">
              View All Professors
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Researchers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center h-64">
            <p>Loading top researchers...</p>
          </div>
        ) : (
          professors.map((professor, index) => {
            const initials = getInitials(professor.name);
            return (
              <Card
                key={professor.id}
                className="relative overflow-hidden transition-all hover:shadow-md"
              >
                <div className="absolute top-0 right-0 p-2 text-yellow-500">
                  <Trophy className="h-6 w-6" />
                </div>
                <CardHeader className="pb-2 text-center">
                  <div className="flex justify-center mb-2">
                    <Avatar className="h-20 w-20 border-2 border-primary/10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${professor.name}`}
                        alt={professor.name}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CardTitle>{professor.name}</CardTitle>
                    {professor.is_verified && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {professor.department}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <span className="text-2xl font-bold">
                      {professor.ranking_points || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      points
                    </span>
                  </div>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1 text-center">
                      Research Interests
                    </h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {professor.research_interests
                        ?.slice(0, 3)
                        .map((interest: string, i: number) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {interest}
                          </Badge>
                        ))}
                      {professor.research_interests?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{professor.research_interests.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Link to={`/professors/${professor.id}`}>
                      <Button variant="outline">View Profile</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Leaderboard Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Professor Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Professor</th>
                  <th className="text-left py-3 px-4">Department</th>
                  <th className="text-right py-3 px-4">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((professor, index) => (
                  <tr key={professor.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${professor.name}`}
                            alt={professor.name}
                          />
                          <AvatarFallback>
                            {getInitials(professor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1">
                          <span>{professor.name}</span>
                          {professor.is_verified && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{professor.department}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="font-semibold">
                          {professor.points}
                        </span>
                        {professor.role === "student" && (
                          <GraduationCap className="h-4 w-4 ml-1 text-primary" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">JU Research Portal</h3>
          <p className="text-sm text-muted-foreground">
            Connecting researchers at Jahangirnagar University to foster
            collaboration and innovation.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/professors" className="text-sm hover:text-primary">
                Professors
              </Link>
            </li>
            <li>
              <Link to="/students" className="text-sm hover:text-primary">
                Students
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="text-sm hover:text-primary">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="text-sm hover:text-primary">
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://scholar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-primary flex items-center gap-1"
              >
                Google Scholar
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.juniv.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-primary flex items-center gap-1"
              >
                Jahangirnagar University
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.researchgate.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-primary flex items-center gap-1"
              >
                ResearchGate
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Developer Contact</h3>
          <p className="text-sm font-medium">Md Akmol Masud</p>
          <a
            href="mailto:akmolmasud5@gmail.com"
            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
          >
            akmolmasud5@gmail.com
          </a>
          <p className="text-sm text-muted-foreground mt-2">+8801304963440</p>
        </div>
      </div>
    </div>
  );
}
