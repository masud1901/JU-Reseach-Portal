import { Progress } from "@/components/ui/progress";
import { Student, Professor } from "@/types/professor";

interface ProfileCompletionIndicatorProps {
  profile: Student | Professor;
  profileType: "student" | "professor";
}

export default function ProfileCompletionIndicator({
  profile,
  profileType,
}: ProfileCompletionIndicatorProps) {
  // Calculate completion percentage based on filled fields
  const calculateCompletion = () => {
    let totalFields = 0;
    let filledFields = 0;

    // Common fields for both profile types
    const commonFields = [
      { name: "name", value: profile.name },
      { name: "bio", value: profile.bio },
      {
        name: "research_interests",
        value: profile.research_interests?.length > 0,
      },
    ];

    totalFields += commonFields.length;
    filledFields += commonFields.filter((field) => !!field.value).length;

    // Professor-specific fields
    if (profileType === "professor") {
      const professorFields = [
        {
          name: "google_scholar_id",
          value: (profile as Professor).google_scholar_id,
        },
        { name: "is_verified", value: (profile as Professor).is_verified },
      ];

      totalFields += professorFields.length;
      filledFields += professorFields.filter((field) => !!field.value).length;
    }

    // Student-specific fields
    if (profileType === "student") {
      const studentFields = [
        { name: "badge", value: (profile as Student).badge },
      ];

      totalFields += studentFields.length;
      filledFields += studentFields.filter((field) => !!field.value).length;
    }

    return Math.round((filledFields / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Profile completion</span>
        <span>{completionPercentage}%</span>
      </div>
      <Progress value={completionPercentage} className="h-1" />
    </div>
  );
}
