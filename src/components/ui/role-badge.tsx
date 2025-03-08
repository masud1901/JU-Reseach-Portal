import { Badge } from "@/components/ui/badge-dark";
import { Shield, GraduationCap, User } from "lucide-react";

interface RoleBadgeProps {
  role: "admin" | "professor" | "student" | "unknown";
  className?: string;
}

export function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  switch (role) {
    case "admin":
      return (
        <Badge variant="destructive" className={className}>
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    case "professor":
      return (
        <Badge variant="default" className={className}>
          <User className="h-3 w-3 mr-1" />
          Professor
        </Badge>
      );
    case "student":
      return (
        <Badge variant="secondary" className={className}>
          <GraduationCap className="h-3 w-3 mr-1" />
          Student
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          User
        </Badge>
      );
  }
}
