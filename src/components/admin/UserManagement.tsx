import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Loader2, Trash2, UserPlus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase";

type User = {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name: string;
    user_type: string;
  };
  email_confirmed_at: string | null;
};

type Professor = {
  id: string;
  user_id: string;
  name: string;
  is_verified: boolean;
};

type Student = {
  id: string;
  user_id: string;
  name: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserType, setNewUserType] = useState<string>("student");
  const [newUserDepartment, setNewUserDepartment] = useState<string>("");
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [creatingUser, setCreatingUser] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchProfessors();
    fetchStudents();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }
      
      setUsers(data.users);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessors = async () => {
    try {
      const { data, error } = await supabase
        .from("professors")
        .select("*");
      
      if (error) {
        throw error;
      }
      
      setProfessors(data);
    } catch (error: any) {
      console.error("Error fetching professors:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*");
      
      if (error) {
        throw error;
      }
      
      setStudents(data);
    } catch (error: any) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("*");
      
      if (error) {
        throw error;
      }
      
      setDepartments(data);
    } catch (error: any) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserFullName || !newUserType || !newUserDepartment) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setCreatingUser(true);

    try {
      // Call the admin_create_user edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin_create_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabase.auth.getSession().then(({ data }) => data.session?.access_token)}`,
        },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          fullName: newUserFullName,
          userType: newUserType,
          department_id: newUserDepartment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      toast({
        title: "Success",
        description: `${newUserType.charAt(0).toUpperCase() + newUserType.slice(1)} created successfully`,
        variant: "default",
      });

      // Reset form and close dialog
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserFullName("");
      setNewUserType("student");
      setNewUserDepartment("");
      setCreateDialogOpen(false);

      // Refresh user lists
      fetchUsers();
      fetchProfessors();
      fetchStudents();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "User deleted successfully",
        variant: "default",
      });
      
      // Refresh user lists
      fetchUsers();
      fetchProfessors();
      fetchStudents();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleVerifyProfessor = async (professorId: string, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from("professors")
        .update({ is_verified: !isVerified })
        .eq("id", professorId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `Professor ${isVerified ? "unverified" : "verified"} successfully`,
        variant: "default",
      });
      
      // Refresh professor list
      fetchProfessors();
    } catch (error: any) {
      console.error("Error updating professor verification:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update professor verification",
        variant: "destructive",
      });
    }
  };

  const getUserType = (user: User) => {
    return user.user_metadata?.user_type || "Unknown";
  };

  const isProfessorVerified = (userId: string) => {
    const professor = professors.find(p => p.user_id === userId);
    return professor ? professor.is_verified : false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Create a new user account with specified role and department.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select
                  value={newUserType}
                  onValueChange={setNewUserType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
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
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateUser}
                disabled={creatingUser}
              >
                {creatingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="professors">Professors</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage all users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.user_metadata?.full_name || "N/A"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getUserType(user)}</TableCell>
                      <TableCell>
                        {user.email_confirmed_at ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="professors">
          <Card>
            <CardHeader>
              <CardTitle>Professors</CardTitle>
              <CardDescription>
                Manage professor accounts and verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter(user => getUserType(user) === "professor")
                    .map((user) => {
                      const professor = professors.find(p => p.user_id === user.id);
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.user_metadata?.full_name || "N/A"}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {isProfessorVerified(user.id) ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {professor && (
                                <Button
                                  variant={isProfessorVerified(user.id) ? "outline" : "default"}
                                  size="sm"
                                  onClick={() => handleVerifyProfessor(professor.id, isProfessorVerified(user.id))}
                                >
                                  {isProfessorVerified(user.id) ? "Unverify" : "Verify"}
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                Manage student accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Email Verified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter(user => getUserType(user) === "student")
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.user_metadata?.full_name || "N/A"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.email_confirmed_at ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>Administrators</CardTitle>
              <CardDescription>
                Manage administrator accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter(user => getUserType(user) === "admin")
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.user_metadata?.full_name || "N/A"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 