import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { GraduationCap, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import AuthLayout from "./AuthLayout";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"professor" | "student">("professor");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters, contain at least one uppercase letter,
    // one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    if (!acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      return;
    }
    
    setLoading(true);

    try {
      // Sign up the user
      const { data, error } = await signUp(email, password, fullName, userType);
      
      if (error) {
        throw error;
      }

      if (data?.user) {
        // Create the appropriate profile based on user type
        if (userType === "professor") {
          // Create professor profile
          const { error: profileError } = await supabase.from("professors").insert([
            {
              user_id: data.user.id,
              name: fullName,
              research_interests: [],
              is_verified: false,
              ranking_points: 0,
            }
          ]);
          
          if (profileError) {
            console.error("Error creating professor profile:", profileError);
          }
        } else if (userType === "student") {
          // Create student profile
          const { error: profileError } = await supabase.from("students").insert([
            {
              user_id: data.user.id,
              name: fullName,
              research_interests: [],
            }
          ]);
          
          if (profileError) {
            console.error("Error creating student profile:", profileError);
          }
        }
      }

      // Store the user type in local storage to redirect them to the correct profile creation page after email verification
      localStorage.setItem("userType", userType);
      
      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
        variant: "default",
      });

      navigate("/success");
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "Error creating account. Please try again.");
      
      toast({
        title: "Error",
        description: error.message || "Error creating account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <UserPlus className="h-5 w-5" /> Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="professor"
            value={userType}
            onValueChange={(value) =>
              setUserType(value as "professor" | "student")
            }
            className="w-full mb-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="professor"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" /> Professor
              </TabsTrigger>
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Student
              </TabsTrigger>
            </TabsList>
            <TabsContent value="professor">
              <p className="text-sm text-muted-foreground mb-4">
                Sign up as a professor to showcase your research and connect
                with students.
              </p>
            </TabsContent>
            <TabsContent value="student">
              <p className="text-sm text-muted-foreground mb-4">
                Sign up as a student to discover research opportunities and
                connect with professors.
              </p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m.example@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters and include uppercase,
                lowercase, number, and special character.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  terms and conditions
                </Link>
              </label>
            </div>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-2 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
