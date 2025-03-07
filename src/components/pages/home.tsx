import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Search,
  Trophy,
  User,
  UserPlus,
  Users,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase";
import { Professor } from "@/types/professor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  const { user } = useAuth();
  const [topProfessors, setTopProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProfessors();
  }, []);

  async function fetchTopProfessors() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("professors")
        .select("*")
        .order("ranking_points", { ascending: false })
        .limit(3);

      if (error) {
        throw error;
      }

      if (data) {
        setTopProfessors(data as Professor[]);
      }
    } catch (error) {
      console.error("Error fetching top professors:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <main className="container mx-auto px-4">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
          <div className="relative w-full max-w-6xl">
            {/* Gradient orbs */}
            <div className="absolute -top-24 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-[100px]" />
            <div className="absolute -right-24 -top-48 -z-10 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[100px]" />

            <div className="flex flex-col items-center justify-center space-y-8 text-center mb-16 pt-16">
              <h1 className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
                JU Research Portal
              </h1>

              <p className="max-w-[700px] animate-fade-up text-muted-foreground/80 md:text-xl">
                Connecting Researchers at Jahangirnagar University
              </p>

              <div className="flex gap-4 mt-8">
                <Link to="/professors">
                  <Button size="lg" className="px-8">
                    Browse Professors
                  </Button>
                </Link>
                {!user && (
                  <Link to="/signup">
                    <Button size="lg" variant="outline" className="px-8">
                      Create Profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Top Researchers Section */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Top Researchers</h2>
                <Link
                  to="/leaderboard"
                  className="text-primary flex items-center"
                >
                  View Full Leaderboard
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading top researchers...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topProfessors.map((professor, index) => {
                    const initials = professor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();

                    return (
                      <Card
                        key={professor.id}
                        className="relative overflow-hidden"
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
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {professor.department}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-center items-center gap-2 mb-4">
                            <span className="text-2xl font-bold">
                              {professor.ranking_points}
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
                                .slice(0, 3)
                                .map((interest, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {interest}
                                  </Badge>
                                ))}
                              {professor.research_interests.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{professor.research_interests.length - 3}{" "}
                                  more
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
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Professor Profiles
                </h3>
                <p className="text-muted-foreground">
                  Discover detailed profiles with research interests,
                  publications, and Google Scholar integration.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Student Researchers
                </h3>
                <p className="text-muted-foreground">
                  Connect with student researchers and explore their research
                  interests and projects.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
                <p className="text-muted-foreground">
                  Find professors and students by name, department, or research
                  interests with powerful filtering options.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Research Rankings
                </h3>
                <p className="text-muted-foreground">
                  Explore top researchers through our gamified ranking system
                  based on publications and citations.
                </p>
              </div>
            </div>

            <div className="mt-20 bg-white p-8 rounded-lg shadow-sm border border-border">
              <h2 className="text-3xl font-bold mb-6 text-center">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <UserPlus className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
                  <p className="text-muted-foreground">
                    Professors create profiles with their research interests and
                    connect their Google Scholar account.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Showcase Research
                  </h3>
                  <p className="text-muted-foreground">
                    Publications are automatically imported and displayed on
                    professor profiles.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connect</h3>
                  <p className="text-muted-foreground">
                    Students discover professors with matching research
                    interests for potential collaboration.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Join the Research Community
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Whether you're a professor looking to showcase your research or
                a student seeking mentorship, the JU Research Portal connects
                the Jahangirnagar University research community.
              </p>
              <Link to={user ? "/professors" : "/signup"}>
                <Button size="lg" className="px-8">
                  {user ? "Explore Professors" : "Get Started"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
