
import { useState } from "react";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";

interface SaveButtonProps {
  onSave: () => Promise<void>;
  className?: string;
}

export function SaveButton({ onSave, className }: SaveButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave();
      toast({
        title: "Changes saved successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to save changes",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      className={className}
      onClick={handleSave}
      loading={loading}
    >
      Save Changes
    </Button>
  );
}
