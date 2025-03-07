import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function ConnectionRequestsStoryboard() {
  const requests = [
    {
      id: "1",
      from_user_id: "user-123",
      name: "Dr. Md. Rahman",
      department: "Computer Science and Engineering",
      type: "professor",
      message:
        "Hello, I noticed your interest in Machine Learning. I'm currently working on a project that might align with your research interests. Would you be interested in discussing potential collaboration?",
    },
    {
      id: "2",
      from_user_id: "user-456",
      name: "Kamal Ahmed",
      department: "Physics",
      type: "student",
      message:
        "Hi, I'm a student researcher in Physics with an interest in computational approaches. I'd love to learn more about your work in quantum computing.",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 bg-slate-50">
      <h1 className="text-3xl font-bold mb-8">Connection Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {request.name}
                <Badge variant="outline">
                  {request.type === "professor" ? "Professor" : "Student"}
                </Badge>
              </CardTitle>
              <CardDescription>{request.department}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {request.message}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <X className="mr-2 h-4 w-4" />
                Decline
              </Button>
              <Button size="sm">
                <Check className="mr-2 h-4 w-4" />
                Accept
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
