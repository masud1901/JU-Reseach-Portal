import { useState, useEffect } from "react";
import { supabase } from "../../../../supabase/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  UserPlus,
  User,
  GraduationCap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);
  const { toast } = useToast();

  // New user form state
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserType, setNewUserType] = useState<"professor" | "student">(
    "professor",
  );
  const [newUserDepartment, setNewUserDepartment] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);

      // Get professors
      const { data: professors, error: professorsError } = await supabase
        .from("professors")
        .select("*, user_id");

      if (professorsError) throw professorsError;

      // Get students
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("*, user_id");

      if (studentsError) throw studentsError;

      // Combine the data
      const combinedUsers = [
        ...professors.map((p) => ({ ...p, type: "professor" })),
        ...students.map((s) => ({ ...s, type: "student" })),
      ];

      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchDepartments() {
    try {
      const { data, error } = await supabase.from("departments").select("name");

      if (error) throw error;

      if (data) {
        setDepartments(data.map((d) => d.name));
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();

    if (
      !newUserEmail ||
      !newUserPassword ||
      !newUserName ||
      !newUserDepartment
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingUser(true);

      // Get department_id from department name
      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .select("id")
        .eq("name", newUserDepartment)
        .single();

      if (deptError) throw deptError;

      // Create user in Supabase Auth
      const { data: authData, error: authError } =
        await supabase.functions.invoke("admin_create_user", {
          body: {
            email: newUserEmail,
            password: newUserPassword,
            fullName: newUserName,
            userType: newUserType,
            department: newUserDepartment,
            department_id: deptData.id,
          },
        });

      if (authError) throw authError;

      toast({
        title: "User created",
        description: `Successfully created ${newUserType} account for ${newUserEmail}`,
      });

      // Reset form
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserName("");
      setNewUserDepartment("");

      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setCreatingUser(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>
            Add a new professor or student account to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createUser} className="space-y-4">
            <Tabs
              defaultValue="professor"
              value={newUserType}
              onValueChange={(v) =>
                setNewUserType(v as "professor" | "student")
              }
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger
                  value="professor"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Professor
                </TabsTrigger>
                <TabsTrigger
                  value="student"
                  className="flex items-center gap-2"
                >
                  <GraduationCap className="h-4 w-4" /> Student
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newUserDepartment}
                  onValueChange={setNewUserDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={creatingUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              {creatingUser
                ? "Creating..."
                : `Create ${newUserType === "professor" ? "Professor" : "Student"} Account`}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage existing users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4">No users found</div>
          ) : (
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-muted-foreground border-b">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Status</div>
              </div>
              <div className="divide-y">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center"
                  >
                    <div className="col-span-3 font-medium">{user.name}</div>
                    <div className="col-span-3 text-sm text-muted-foreground">
                      {user.email || "No email"}
                    </div>
                    <div className="col-span-2">
                      <Badge
                        variant={
                          user.type === "professor" ? "default" : "secondary"
                        }
                      >
                        {user.type === "professor" ? "Professor" : "Student"}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-sm">{user.department}</div>
                    <div className="col-span-2">
                      {user.is_verified ? (
                        <Badge className="bg-green-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <XCircle className="h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
