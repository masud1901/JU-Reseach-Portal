import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge-dark";
import { Button } from "@/components/ui/button-dark";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-dark";
import { CheckCircle2, GraduationCap, Trophy, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLeaderboard, LeaderboardEntry } from "@/hooks/useLeaderboard";
import { getInitials } from "@/utils/formatUtils";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | "professors" | "students">(
    "all",
  );
  const { leaderboardData, loading, error } = useLeaderboard(50);

  // Filter data based on active tab
  const filteredData = leaderboardData.filter((entry) => {
    if (activeTab === "all") return true;
    if (activeTab === "professors") return entry.role === "professor";
    if (activeTab === "students") return entry.role === "student";
    return true;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Research Leaderboard</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("all")}
          >
            All Researchers
          </Button>
          <Button
            variant={activeTab === "professors" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("professors")}
          >
            Professors
          </Button>
          <Button
            variant={activeTab === "students" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("students")}
          >
            Students
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Top 3 Researchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center h-64">
            <p>Loading top researchers...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="col-span-3 flex justify-center items-center h-64">
            <p>No researchers found in this category.</p>
          </div>
        ) : (
          filteredData
            .slice(0, 3)
            .map((entry, index) => (
              <TopResearcherCard
                key={entry.id}
                entry={entry}
                rank={index + 1}
              />
            ))
        )}
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Research Rankings</CardTitle>
          <CardDescription>
            Top researchers ranked by publication impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Researcher</th>
                  <th className="text-left py-3 px-4">Department</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-right py-3 px-4">Points</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      Loading leaderboard data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      No researchers found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((entry, index) => (
                    <LeaderboardRow
                      key={entry.id}
                      entry={entry}
                      rank={index + 1}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component for top researcher card
function TopResearcherCard({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: number;
}) {
  const initials = getInitials(entry.name);
  const profileLink =
    entry.role === "professor"
      ? `/professors/${entry.id}`
      : `/students/${entry.id}`;

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      <div className="absolute top-0 right-0 p-2 text-yellow-500">
        <Trophy className="h-6 w-6" />
      </div>
      <CardHeader className="pb-2 text-center">
        <div className="flex justify-center mb-2">
          <Avatar className="h-20 w-20 border-2 border-primary/10">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.name}`}
              alt={entry.name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center justify-center gap-2">
          <CardTitle>{entry.name}</CardTitle>
          {entry.is_verified && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <CardDescription>{entry.department}</CardDescription>
          <Badge variant="outline" className="text-xs">
            {entry.role === "professor" ? "Professor" : "Student"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="text-2xl font-bold">{entry.points}</span>
          <span className="text-sm text-muted-foreground">points</span>
        </div>

        <div className="mt-4 flex justify-center">
          <Link to={profileLink}>
            <Button variant="outline">View Profile</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for leaderboard table row
function LeaderboardRow({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: number;
}) {
  const initials = getInitials(entry.name);
  const profileLink =
    entry.role === "professor"
      ? `/professors/${entry.id}`
      : `/students/${entry.id}`;

  return (
    <tr className="border-b hover:bg-muted/30">
      <td className="py-3 px-4">{rank}</td>
      <td className="py-3 px-4">
        <Link to={profileLink} className="hover:underline">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.name}`}
                alt={entry.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span>{entry.name}</span>
              {entry.is_verified && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        </Link>
      </td>
      <td className="py-3 px-4">{entry.department}</td>
      <td className="py-3 px-4">
        {entry.role === "professor" ? (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 text-primary" />
            <span>Professor</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>Student</span>
          </div>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="inline-flex items-center justify-end gap-1">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="font-semibold">{entry.points}</span>
        </div>
      </td>
    </tr>
  );
}
