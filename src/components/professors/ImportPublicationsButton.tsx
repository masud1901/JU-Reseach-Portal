import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ImportPublicationsButtonProps {
  professorId: string;
  onSuccess?: () => void;
}

export default function ImportPublicationsButton({
  professorId,
  onSuccess,
}: ImportPublicationsButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      setLoading(true);

      // Call the import_google_scholar edge function
      const { data: functionData, error: functionError } =
        await supabase.functions.invoke("import-google-scholar", {
          body: { professorId },
        });

      if (functionError) {
        throw functionError;
      }

      toast({
        title: "Publications imported",
        description: `Successfully imported ${functionData.count} publications.`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error importing publications:", error);
      toast({
        title: "Import failed",
        description:
          "There was an error importing publications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleImport}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {loading ? "Importing..." : "Import Publications"}
    </Button>
  );
}
