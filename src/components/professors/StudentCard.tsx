import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Student } from "@/types/professor";
import { Link } from "react-router-dom";

interface StudentCardProps {
  student: Student;
}

export default function StudentCard({ student }: StudentCardProps) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                alt={student.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{student.name}</h3>
                {student.badge && (
                  <Badge variant="outline" className="text-xs">
                    {student.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {student.department}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-1">Research Interests</h4>
          <div className="flex flex-wrap gap-1">
            {student.research_interests.map((interest, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        {student.bio && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
            {student.bio}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/students/${student.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
