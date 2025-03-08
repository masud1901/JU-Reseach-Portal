import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Professor } from "@/types/professor";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfessorCardProps {
  professor: Professor & { matchScore?: number; matchingKeywords?: number };
  showMatchScore?: boolean;
}

export default function ProfessorCard({ professor, showMatchScore = false }: ProfessorCardProps) {
  const initials = professor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const getMatchColor = (score: number) => {
    if (score >= 75) return "bg-green-100 text-green-800 border-green-300";
    if (score >= 50) return "bg-blue-100 text-blue-800 border-blue-300";
    if (score >= 25) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${professor.name}`}
                alt={professor.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{professor.name}</h3>
                <div className="flex items-center gap-1">
                  {professor.is_verified && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {professor.seeking_students && (
                    <Badge variant="secondary" className="text-xs">
                      Seeking Students
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {professor.department}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="font-semibold">{professor.ranking_points}</span>
            <span className="text-xs">points</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-1">Research Interests</h4>
          <div className="flex flex-wrap gap-1">
            {professor.research_interests.map((interest, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        {professor.bio && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
            {professor.bio}
          </p>
        )}
        {showMatchScore && professor.matchScore !== undefined && (
          <div className="mt-2 mb-3">
            <div className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center border ${getMatchColor(professor.matchScore)}`}>
              <span className="mr-1">Match:</span>
              <span className="font-bold">{professor.matchScore}%</span>
            </div>
            {professor.matchingKeywords !== undefined && professor.matchingKeywords > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {professor.matchingKeywords} shared research {professor.matchingKeywords === 1 ? 'interest' : 'interests'}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/professors/${professor.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
