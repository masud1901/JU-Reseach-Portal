import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Users, BookOpen, Award } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboardStoryboard() {
  type Professor = {
    id: string;
    name: string;
    department: string;
    research_interests: string[];
    is_verified: boolean;
  };

  const professors = [
    {
      id: "1",
      name: "Dr. Md. Rahman",
      department: "Computer Science and Engineering",
      research_interests: [
        "Machine Learning",
        "Artificial Intelligence",
        "Computer Vision",
      ],
      is_verified: true,
    },
    {
      id: "2",
      name: "Dr. Fatima Ahmed",
      department: "Physics",
      research_interests: [
        "Quantum Physics",
        "Theoretical Physics",
        "Particle Physics",
      ],
      is_verified: true,
    },
    {
      id: "3",
      name: "Dr. Nusrat Jahan",
      department: "Chemistry",
      research_interests: [
        "Organic Chemistry",
        "Medicinal Chemistry",
        "Natural Products",
      ],
      is_verified: false,
    },
    {
      id: "4",
      name: "Dr. Sadia Rahman",
      department: "English",
      research_interests: [
        "Postcolonial Literature",
        "South Asian Writing",
        "Feminist Theory",
      ],
      is_verified: false,
    },
  ];

  const columns: ColumnDef<Professor>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "research_interests",
      header: "Research Interests",
      cell: ({ row }) => {
        const interests = row.original.research_interests;
        return (
          <div className="flex flex-wrap gap-1">
            {interests.slice(0, 2).map((interest, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
            {interests.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{interests.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_verified",
      header: "Status",
      cell: ({ row }) => {
        return row.original.is_verified ? (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </Badge>
        ) : (
          <Badge variant="outline">Pending</Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const professor = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              View
            </Button>
            {professor.is_verified ? (
              <Button variant="destructive" size="sm">
                Unverify
              </Button>
            ) : (
              <Button variant="default" size="sm">
                Verify
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 bg-slate-50">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Manage professors, publications, and system settings
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Professors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Professors
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              70% verification rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Publications
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="verification" className="space-y-4">
        <TabsList>
          <TabsTrigger value="verification">
            <CheckCircle className="h-4 w-4 mr-2" /> Professor Verification
          </TabsTrigger>
          <TabsTrigger value="rankings">
            <Award className="h-4 w-4 mr-2" /> Ranking Management
          </TabsTrigger>
        </TabsList>
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professor Verification</CardTitle>
              <CardDescription>
                Review and verify professor profiles to ensure authenticity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={professors}
                searchKey="name"
                searchPlaceholder="Search professors..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ranking Management</CardTitle>
              <CardDescription>
                Manage the ranking algorithm and update professor rankings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This feature will be available in the next update. Currently,
                rankings are automatically calculated based on publication count
                and citation metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
