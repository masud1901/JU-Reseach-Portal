import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { ConnectionRequest } from "@/types/professor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Check, X } from "lucide-react";

export default function ConnectionRequests() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConnectionRequests();
    }
  }, [user]);

  async function fetchConnectionRequests() {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("connection_requests")
        .select("*")
        .eq("to_user_id", user.id)
        .eq("status", "pending");

      if (error) {
        throw error;
      }

      if (data) {
        setRequests(data as ConnectionRequest[]);
        await fetchUserProfiles(data.map((req) => req.from_user_id));
      }
    } catch (error) {
      console.error("Error fetching connection requests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserProfiles(userIds: string[]) {
    if (userIds.length === 0) return;

    try {
      // First try to get professors
      const { data: professors, error: professorError } = await supabase
        .from("professors")
        .select("user_id, name, department")
        .in("user_id", userIds);

      if (professorError) {
        throw professorError;
      }

      // Then try to get students
      const { data: students, error: studentError } = await supabase
        .from("students")
        .select("user_id, name, department")
        .in("user_id", userIds);

      if (studentError) {
        throw studentError;
      }

      // Combine the results
      const profiles: Record<string, any> = {};
      professors?.forEach((prof) => {
        profiles[prof.user_id] = { ...prof, type: "professor" };
      });
      students?.forEach((student) => {
        profiles[student.user_id] = { ...student, type: "student" };
      });

      setUserProfiles(profiles);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
  }

  async function handleConnectionResponse(requestId: string, accept: boolean) {
    try {
      const { error } = await supabase
        .from("connection_requests")
        .update({ status: accept ? "accepted" : "rejected" })
        .eq("id", requestId);

      if (error) {
        throw error;
      }

      // Update the local state
      setRequests(requests.filter((req) => req.id !== requestId));

      toast({
        title: accept ? "Connection accepted" : "Connection declined",
        description: accept
          ? "You can now communicate with this user"
          : "The connection request has been declined",
      });
    } catch (error) {
      console.error("Error updating connection request:", error);
      toast({
        title: "Error",
        description: "There was an error processing your request",
        variant: "destructive",
      });
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p>Please log in to view your connection requests.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Connection Requests</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading connection requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium">
            No pending connection requests
          </h3>
          <p className="text-muted-foreground mt-2">
            When someone wants to connect with you, their request will appear
            here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => {
            const profile = userProfiles[request.from_user_id];
            return (
              <Card key={request.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {profile?.name || "Unknown User"}
                    {profile?.type && (
                      <Badge variant="outline">
                        {profile.type === "professor" ? "Professor" : "Student"}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {profile?.department || "Unknown Department"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {request.message || "No message provided."}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnectionResponse(request.id, false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleConnectionResponse(request.id, true)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
