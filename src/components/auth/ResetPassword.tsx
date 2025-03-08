import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import AuthLayout from "./AuthLayout";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if the URL contains a reset token
  useEffect(() => {
    const checkResetToken = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes("type=recovery")) {
        // The URL contains a recovery token
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          setError("Invalid or expired reset link. Please request a new one.");
          toast({
            title: "Error",
            description: "Invalid or expired reset link. Please request a new one.",
            variant: "destructive",
          });
        }
      } else {
        // No recovery token found
        setError("No reset token found. Please request a password reset.");
        toast({
          title: "Error",
          description: "No reset token found. Please request a password reset.",
          variant: "destructive",
        });
      }
    };

    checkResetToken();
  }, [toast]);

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters, contain at least one uppercase letter,
    // one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords
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
      const { error } = await updatePassword(password);
      
      if (error) {
        throw error;
      }

      setSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully.",
        variant: "default",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "Failed to reset password. Please try again.");
      
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
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
            <KeyRound className="h-5 w-5" /> Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-800 p-4 rounded-md">
                <p>Password reset successful!</p>
                <p className="text-sm mt-2">
                  Your password has been reset successfully. You will be redirected to the login page shortly.
                </p>
              </div>
              <Button asChild className="mt-4">
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters and include uppercase, lowercase, 
                  number, and special character.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-slate-600">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
} 