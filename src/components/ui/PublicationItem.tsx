import { Badge } from "@/components/ui/badge-dark";
import { Publication } from "@/types/profile";
import { formatAuthors, formatPublicationSource } from "@/utils/formatUtils";
import { ExternalLink } from "lucide-react";

interface PublicationItemProps {
  publication: Publication;
}

export default function PublicationItem({ publication }: PublicationItemProps) {
  const {
    title,
    authors,
    journal_name,
    publisher,
    publication_year,
    citation_count,
    publication_type,
    url,
  } = publication;

  return (
    <div className="border-b pb-6 last:border-0">
      <h3 className="font-medium">{title || "Untitled Publication"}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {formatAuthors(authors)}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        {formatPublicationSource(journal_name, publisher)},{" "}
        {publication_year || "N/A"}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="outline" className="text-xs">
          {citation_count || 0} citations
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {publication_type || "Research Article"}
        </Badge>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-xs text-blue-600 hover:underline mt-2"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View Publication
        </a>
      )}
    </div>
  );
}
