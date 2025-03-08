import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { KeyRound, Loader2, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";

export default function ProfileSettings() {
  const { user, updateUserProfile, updatePassword, sendVerificationEmail } = useAuth();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");
      setEmailVerified(user.email_confirmed_at ? true : false);
    }
  }, [user]);

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters, contain at least one uppercase letter,
    // one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let newAvatarUrl = avatarUrl;

      // Upload avatar if a new file is selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        newAvatarUrl = data.publicUrl;
      }

      // Update user profile
      const { error } = await updateUserProfile({
        full_name: fullName,
        avatar_url: newAvatarUrl,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      setError(error.message || "Failed to update profile. Please try again.");
      
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (!validatePassword(newPassword)) {
      setPasswordError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      return;
    }
    
    setPasswordLoading(true);

    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        throw error;
      }

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      setPasswordError(error.message || "Failed to update password. Please try again.");
      
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setVerificationLoading(true);

    try {
      const { error } = await sendVerificationEmail(user.email);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Verification email sent",
        description: "Check your email for a verification link.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Verification error:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Avatar image must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      
      setAvatarFile(file);
      // Create a preview URL
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and avatar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <Label htmlFor="avatar" className="cursor-pointer text-primary hover:underline">
                        Change Avatar
                      </Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email || ""}
                        disabled
                      />
                      {!emailVerified && (
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-amber-600">Email not verified</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleResendVerification}
                            disabled={verificationLoading}
                          >
                            {verificationLoading ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              "Verify Email"
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                
                <Button type="submit" disabled={passwordLoading} className="w-full">
                  {passwordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 