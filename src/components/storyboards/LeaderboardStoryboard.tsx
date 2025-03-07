import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Medal, Trophy } from "lucide-react";

export default function LeaderboardStoryboard() {
  const professors = [
    {
      id: "1",
      name: "Dr. Md. Rahman",
      department: "Computer Science and Engineering",
      is_verified: true,
      ranking_points: 320,
    },
    {
      id: "2",
      name: "Dr. Fatima Ahmed",
      department: "Physics",
      is_verified: true,
      ranking_points: 280,
    },
    {
      id: "3",
      name: "Dr. Anisur Khan",
      department: "Mathematics",
      is_verified: true,
      ranking_points: 210,
    },
    {
      id: "4",
      name: "Dr. Kamal Hossain",
      department: "Environmental Science",
      is_verified: true,
      ranking_points: 230,
    },
    {
      id: "5",
      name: "Dr. Nasreen Akter",
      department: "Public Health",
      is_verified: true,
      ranking_points: 240,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-700";
      default:
        return "text-slate-600";
    }
  };

  const top3 = professors.slice(0, 3);
  const rest = professors.slice(3);

  return (
    <div className="container mx-auto py-8 px-4 bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" /> Research Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Top researchers ranked by publication impact
          </p>
        </div>

        <Select defaultValue="">
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Departments</SelectItem>
            <SelectItem value="cse">
              Computer Science and Engineering
            </SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {/* Top 3 Professors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {top3.map((professor, index) => (
            <Card key={professor.id} className="relative overflow-hidden">
              <div
                className={`absolute top-0 right-0 p-2 ${getMedalColor(index)}`}
              >
                <Medal className="h-6 w-6" />
              </div>
              <CardHeader className="pb-2 text-center">
                <div className="flex justify-center mb-2">
                  <Avatar className="h-20 w-20 border-2 border-primary/10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${professor.name}`}
                      alt={professor.name}
                    />
                    <AvatarFallback>
                      {getInitials(professor.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CardTitle>{professor.name}</CardTitle>
                  {professor.is_verified && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {professor.department}
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="text-2xl font-bold">
                    {professor.ranking_points}
                  </span>
                  <span className="text-sm text-muted-foreground">points</span>
                </div>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rest of the Professors */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-muted-foreground border-b">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5 md:col-span-4">Professor</div>
            <div className="col-span-4 hidden md:block">Department</div>
            <div className="col-span-2 text-center">Points</div>
            <div className="col-span-2 md:col-span-1"></div>
          </div>

          {rest.map((professor, index) => (
            <div
              key={professor.id}
              className="grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0 hover:bg-muted/20"
            >
              <div className="col-span-1 text-center font-medium">
                {index + 4}
              </div>
              <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 hidden sm:block">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${professor.name}`}
                    alt={professor.name}
                  />
                  <AvatarFallback>{getInitials(professor.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium flex items-center gap-1">
                    {professor.name}
                    {professor.is_verified && (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-4 hidden md:block text-muted-foreground">
                {professor.department}
              </div>
              <div className="col-span-2 text-center">
                <Badge variant="outline" className="font-semibold">
                  {professor.ranking_points}
                </Badge>
              </div>
              <div className="col-span-2 md:col-span-1 text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
