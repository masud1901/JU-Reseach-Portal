import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Professor } from "@/types/professor";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import ProfessorCard from "./ProfessorCard";

export default function ProfessorList() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [matchThreshold, setMatchThreshold] = useState(0);
  const [professorsWithScores, setProfessorsWithScores] = useState<any[]>([]);
  const { user } = useAuth();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchProfessors();
    fetchDepartments();
  }, []);

  useEffect(() => {
    async function getStudentId() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("students")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching student profile:", error);
          return;
        }

        if (data) {
          setStudentId(data.id);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getStudentId();
  }, [user]);

  async function fetchProfessors() {
    try {
      setLoading(true);

      let query = supabase
        .from("professors")
        .select("*, departments(name)")
        .order("ranking_points", { ascending: false });

      if (selectedDepartment && selectedDepartment !== "all") {
        query = query.eq("departments.name", selectedDepartment);
      }

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match the expected Professor type
        const transformedData = data.map((prof) => ({
          ...prof,
          department: prof.departments?.name || "",
        }));

        setProfessors(transformedData);

        // Calculate match scores if student is logged in
        if (studentId) {
          const withScores = await calculateMatchScores(
            studentId,
            transformedData,
          );
          setProfessorsWithScores(withScores);
        } else {
          setProfessorsWithScores(
            transformedData.map((p) => ({ ...p, matchScore: 0 })),
          );
        }
      }
    } catch (error) {
      console.error("Error fetching professors:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDepartments() {
    try {
      const { data, error } = await supabase.from("departments").select("name");

      if (error) {
        throw error;
      }

      if (data) {
        setDepartments(data.map((d) => d.name));
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }

  const filteredProfessors = professors
    .filter((professor) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professor.research_interests.some((interest) =>
          interest.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      // Filter by department name
      const matchesDepartment =
        selectedDepartment === "all" ||
        professor.department === selectedDepartment;

      // Filter by verification status
      const matchesVerification = !verifiedOnly || professor.is_verified;

      return matchesSearch && matchesDepartment && matchesVerification;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "department") {
        return a.department.localeCompare(b.department);
      } else if (sortBy === "ranking") {
        return b.ranking_points - a.ranking_points;
      }
      return 0;
    });

  async function calculateMatchScores(studentId: string, professors: any[]) {
    try {
      // Get student's research interests
      const { data: studentKeywords, error: studentError } = await supabase
        .from("student_research_keywords")
        .select("research_keyword_id")
        .eq("student_id", studentId);

      if (studentError) throw studentError;

      if (!studentKeywords || studentKeywords.length === 0) {
        return professors.map((prof) => ({ ...prof, matchScore: 0 }));
      }

      const studentKeywordIds = studentKeywords.map(
        (k) => k.research_keyword_id,
      );

      // Get all professor research keywords
      const { data: profKeywords, error: profError } = await supabase
        .from("professor_research_keywords")
        .select("professor_id, research_keyword_id")
        .in(
          "professor_id",
          professors.map((p) => p.id),
        );

      if (profError) throw profError;

      // Calculate match scores
      const professorsWithScores = professors.map((professor) => {
        // Get this professor's keywords
        const profKeywordIds = profKeywords
          .filter((k) => k.professor_id === professor.id)
          .map((k) => k.research_keyword_id);

        // Count matching keywords
        const matchingKeywords = studentKeywordIds.filter((id) =>
          profKeywordIds.includes(id),
        );

        // Calculate score (0-100)
        // Formula: (matching keywords / total unique keywords) * 100
        const uniqueKeywords = new Set([
          ...studentKeywordIds,
          ...profKeywordIds,
        ]);
        const matchScore = Math.round(
          (matchingKeywords.length / uniqueKeywords.size) * 100,
        );

        return {
          ...professor,
          matchScore,
          matchingKeywords: matchingKeywords.length,
        };
      });

      return professorsWithScores;
    } catch (error) {
      console.error("Error calculating match scores:", error);
      return professors.map((prof) => ({ ...prof, matchScore: 0 }));
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Professor Directory</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search professors or research topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="ranking">Ranking</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Professors</SheetTitle>
                  <SheetDescription>
                    Refine the professor list using these filters.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Department</h3>
                    <Select
                      value={selectedDepartment}
                      onValueChange={setSelectedDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Verification</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified"
                        checked={verifiedOnly}
                        onCheckedChange={(checked) =>
                          setVerifiedOnly(checked as boolean)
                        }
                      />
                      <Label htmlFor="verified">Verified professors only</Label>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedDepartment("");
                      setVerifiedOnly(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {studentId && (
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Professors</TabsTrigger>
              <TabsTrigger value="matches">Research Matches</TabsTrigger>
            </TabsList>

            {activeTab === "matches" && (
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Minimum Match Score</h3>
                  <span className="font-semibold">{matchThreshold}%</span>
                </div>
                <Slider
                  value={[matchThreshold]}
                  onValueChange={(value) => setMatchThreshold(value[0])}
                  max={100}
                  step={5}
                  className="mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  Showing professors with at least {matchThreshold}% research
                  interest match.
                </p>
              </div>
            )}
          </Tabs>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading professors...</p>
        </div>
      ) : activeTab === "matches" && studentId ? (
        // Matches view
        professorsWithScores
          .filter((prof) => prof.matchScore >= matchThreshold)
          .sort((a, b) => b.matchScore - a.matchScore).length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium">
              No matching professors found
            </h3>
            <p className="text-muted-foreground mt-2">
              Try lowering the match threshold or updating your research
              interests
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {professorsWithScores
              .filter((prof) => prof.matchScore >= matchThreshold)
              .sort((a, b) => b.matchScore - a.matchScore)
              .map((professor) => (
                <ProfessorCard
                  key={professor.id}
                  professor={professor}
                  showMatchScore={true}
                />
              ))}
          </div>
        )
      ) : // Regular view
      professors.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium">No professors found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {professors.map((professor) => (
            <ProfessorCard
              key={professor.id}
              professor={professor}
              showMatchScore={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
