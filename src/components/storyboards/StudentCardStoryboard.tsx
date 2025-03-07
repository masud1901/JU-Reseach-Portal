import StudentCard from "@/components/professors/StudentCard";

export default function StudentCardStoryboard() {
  const sampleStudent = {
    id: "1",
    user_id: "user-123",
    name: "Rahima Khan",
    department: "Computer Science and Engineering",
    research_interests: ["Machine Learning", "Natural Language Processing"],
    bio: "Graduate student researching applications of NLP in Bangla language processing.",
    badge: "Rising Star",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="p-6 bg-slate-50">
      <div className="max-w-md">
        <StudentCard student={sampleStudent} />
      </div>
    </div>
  );
}
