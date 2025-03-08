import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";

interface ResearchInterestMatchesProps {
  studentId?: string;
  professorId?: string;
  limit?: number;
  showViewAll?: boolean;
}

export default function ResearchInterestMatches({
  studentId,
  professorId,
  limit = 3,
  showViewAll = true,
}: ResearchInterestMatchesProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (studentId) {
      fetchMatchingProfessors();
    } else if (professorId) {
      fetchMatchingStudents();
    }
  }, [studentId, professorId]);

  async function fetchMatchingProfessors() {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc(
        "get_matching_professors_for_student",
        { student_id: studentId }
      );

      if (error) throw error;

      if (data) {
        setMatches(data.slice(0, limit));
      }
    } catch (error) {
      console.error("Error fetching matching professors:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMatchingStudents() {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc(
        "get_matching_students_for_professor",
        { professor_id: professorId }
      );

      if (error) throw error;

      if (data) {
        setMatches(data.slice(0, limit));
      }
    } catch (error) {
      console.error("Error fetching matching students:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Research Matches</CardTitle>
          <CardDescription>
            {studentId
              ? "Professors with similar research interests"
              : "Students with similar research interests"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Research Matches</CardTitle>
          <CardDescription>
            {studentId
              ? "Professors with similar research interests"
              : "Students with similar research interests"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">No matches found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {studentId
                ? "Update your research interests to find matching professors"
                : "Update your research interests to find matching students"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Matches</CardTitle>
        <CardDescription>
          {studentId
            ? "Professors with similar research interests"
            : "Students with similar research interests"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.professor_id || match.student_id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${match.professor_name || match.student_name}`}
                  />
                  <AvatarFallback>
                    {(match.professor_name || match.student_name)
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {match.professor_name || match.student_name}
                    </p>
                    {match.is_verified && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {match.department_name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {match.match_count} shared interests
                    </Badge>
                    {match.seeking_students && (
                      <Badge variant="secondary" className="text-xs">
                        Seeking Students
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(
                    match.professor_id
                      ? `/professors/${match.professor_id}`
                      : `/students/${match.student_id}`
                  )
                }
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      {showViewAll && matches.length > 0 && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              navigate(
                studentId
                  ? "/professors?tab=matches"
                  : "/students?tab=matches"
              )
            }
          >
            View All Matches
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 