import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ResearchKeywordSelectorProps {
  selectedKeywords: string[];
  onChange: (keywords: string[]) => void;
}

export default function ResearchKeywordSelector({
  selectedKeywords,
  onChange,
}: ResearchKeywordSelectorProps) {
  const [availableKeywords, setAvailableKeywords] = useState<
    { id: string; keyword: string }[]
  >([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeywords();
  }, []);

  async function fetchKeywords() {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_research_keywords");

      if (error) {
        throw error;
      }

      if (data) {
        setAvailableKeywords(data);
      }
    } catch (error) {
      console.error("Error fetching keywords:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddKeyword = (keyword: string) => {
    if (keyword && !selectedKeywords.includes(keyword)) {
      onChange([...selectedKeywords, keyword]);
      setNewKeyword("");
      setOpen(false);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    onChange(selectedKeywords.filter((k) => k !== keyword));
  };

  const filteredKeywords = availableKeywords.filter(
    (item) => !selectedKeywords.includes(item.keyword),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label>Research Interests</Label>
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                disabled={loading}
              >
                {loading ? "Loading keywords..." : "Add research interest"}
                <Plus className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start" side="bottom">
              <Command>
                <CommandInput
                  placeholder="Search or add new keyword..."
                  value={newKeyword}
                  onValueChange={setNewKeyword}
                />
                <CommandList>
                  <CommandEmpty>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => handleAddKeyword(newKeyword)}
                    >
                      Add "{newKeyword}"
                    </Button>
                  </CommandEmpty>
                  <CommandGroup heading="Available Keywords">
                    {filteredKeywords.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.keyword}
                        onSelect={() => handleAddKeyword(item.keyword)}
                      >
                        {item.keyword}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {selectedKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedKeywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1">
              {keyword}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => handleRemoveKeyword(keyword)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
