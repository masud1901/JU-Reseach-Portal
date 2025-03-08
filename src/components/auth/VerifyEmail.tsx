import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, MailCheck, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import AuthLayout from "./AuthLayout";

export default function VerifyEmail() {
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const { sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the URL contains a verification token
    const checkVerificationToken = async () => {
      const hash = window.location.hash;
      
      if (hash && hash.includes("type=signup")) {
        // The URL contains a verification token
        setVerifying(true);
        
        try {
          // Get the email from localStorage if available
          const storedEmail = localStorage.getItem("verificationEmail");
          if (storedEmail) {
            setEmail(storedEmail);
          }
          
          // Check if the user is now verified
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data.session) {
            setVerified(true);
            setVerifying(false);
            
            toast({
              title: "Email verified",
              description: "Your email has been verified successfully.",
              variant: "default",
            });
            
            // Redirect to dashboard or profile creation based on user type
            const userType = localStorage.getItem("userType");
            
            setTimeout(() => {
              if (userType === "professor") {
                navigate("/create-professor-profile");
              } else {
                navigate("/create-student-profile");
              }
            }, 3000);
          } else {
            setVerified(false);
            setVerifying(false);
            setError("Email verification failed. Please try again.");
          }
        } catch (error: any) {
          console.error("Verification error:", error);
          setVerified(false);
          setVerifying(false);
          setError(error.message || "Email verification failed. Please try again.");
          
          toast({
            title: "Verification failed",
            description: error.message || "Email verification failed. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // No verification token found
        setVerifying(false);
        setVerified(false);
      }
    };

    checkVerificationToken();
  }, [navigate, toast]);

  const handleResendVerification = async () => {
    if (!email) {
      setError("Email is required to resend verification");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const { error } = await sendVerificationEmail(email);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Verification email sent",
        description: "Check your email for a new verification link.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Resend verification error:", error);
      setError(error.message || "Failed to resend verification email. Please try again.");
      
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email. Please try again.",
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
            <MailCheck className="h-5 w-5" /> Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verifying ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Verifying your email...</p>
            </div>
          ) : verified ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold">Email Verified Successfully!</h2>
              <p className="text-muted-foreground">
                Your email has been verified. You will be redirected to complete your profile.
              </p>
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Please verify your email address to continue. Check your inbox for a verification link.
              </p>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="pt-4">
                <Button 
                  onClick={handleResendVerification} 
                  disabled={loading} 
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-slate-600">
            <Link to="/login" className="text-primary hover:underline">
              Return to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
} 