import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Users, BookOpen, Award, UserPlus } from "lucide-react";
import ProfessorVerificationTable from "./ProfessorVerificationTable";
import AdminAccessControl from "./AdminAccessControl";
import UserManagement from "./UserManagement";
import { Button } from "@/components/ui/button";
import { supabase } from "../../../../supabase/supabase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("verification");

  return (
    <AdminAccessControl>
      <div className="container mx-auto py-8 px-4">
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
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
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
              <p className="text-xs text-muted-foreground">
                +5 from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="verification">
              <CheckCircle className="h-4 w-4 mr-2" /> Professor Verification
            </TabsTrigger>
            <TabsTrigger value="rankings">
              <Award className="h-4 w-4 mr-2" /> Ranking Management
            </TabsTrigger>
            <TabsTrigger value="users">
              <UserPlus className="h-4 w-4 mr-2" /> User Management
            </TabsTrigger>
          </TabsList>
          <TabsContent value="verification" className="space-y-4">
            <ProfessorVerificationTable />
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
                  Rankings are automatically calculated based on the following
                  criteria:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Base points: 10 points per publication</li>
                  <li>Citation impact: 1 point per citation</li>
                  <li>
                    Recency factor: More recent publications get higher weight
                  </li>
                  <li>Verification bonus: Verified profiles get a 10% bonus</li>
                </ul>
                <Button
                  onClick={() => {
                    supabase.functions.invoke("update_professor_rankings");
                  }}
                >
                  Recalculate All Rankings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminAccessControl>
  );
}
