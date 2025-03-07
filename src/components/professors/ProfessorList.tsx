import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { Professor } from "@/types/professor";
import ProfessorCard from "./ProfessorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ProfessorList() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchProfessors();
    fetchDepartments();
  }, []);

  async function fetchProfessors() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("professors").select("*");

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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading professors...</p>
        </div>
      ) : filteredProfessors.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium">No professors found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessors.map((professor) => (
            <ProfessorCard key={professor.id} professor={professor} />
          ))}
        </div>
      )}
    </div>
  );
}
