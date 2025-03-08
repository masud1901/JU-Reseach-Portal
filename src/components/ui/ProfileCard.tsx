import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge-dark";
import { Button } from "@/components/ui/button-dark";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card-dark";
import { getInitials } from "@/utils/formatUtils";
import { CheckCircle2, Award, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  id: string;
  name: string;
  department: string;
  role: "professor" | "student";
  badge?: string;
  isVerified?: boolean;
  rankingPoints?: number;
  seekingStudents?: boolean;
  researchInterests?: string[];
  bio?: string;
  matchScore?: number;
  matchingKeywords?: number;
}

export default function ProfileCard({
  id,
  name,
  department,
  role,
  badge,
  isVerified,
  rankingPoints,
  seekingStudents,
  researchInterests = [],
  bio,
  matchScore,
  matchingKeywords,
}: ProfileCardProps) {
  const initials = getInitials(name);
  const profileLink =
    role === "professor" ? `/professors/${id}` : `/students/${id}`;

  const getMatchColor = (score: number) => {
    if (score >= 75)
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    if (score >= 50)
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    if (score >= 25)
      return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
    return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
                alt={name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{name}</h3>
                <div className="flex items-center gap-1">
                  {isVerified && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {role === "professor" && seekingStudents && (
                    <Badge variant="secondary" className="text-xs">
                      Seeking Students
                    </Badge>
                  )}
                  {role === "student" && badge && (
                    <Badge variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{department}</p>
              {rankingPoints !== undefined && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 mt-1"
                >
                  <span className="font-semibold">{rankingPoints}</span>
                  <span className="text-xs">points</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-1">Research Interests</h4>
          <div className="flex flex-wrap gap-1">
            {researchInterests.map((interest, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        {bio && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
            {bio}
          </p>
        )}
        {matchScore !== undefined && (
          <div className="mt-2 mb-3">
            <div
              className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center border ${getMatchColor(matchScore)}`}
            >
              <span className="mr-1">Match:</span>
              <span className="font-bold">{matchScore}%</span>
            </div>
            {matchingKeywords !== undefined && matchingKeywords > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {matchingKeywords} shared research{" "}
                {matchingKeywords === 1 ? "interest" : "interests"}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to={profileLink} className="w-full">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
