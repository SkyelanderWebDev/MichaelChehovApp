import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen } from "lucide-react";

interface FlybackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (journalEntry: string) => void;
  initialValue?: string;
  toolName: string;
}

export default function FlybackModal({
  isOpen,
  onClose,
  onSave,
  initialValue = "",
  toolName,
}: FlybackModalProps) {
  const [journalEntry, setJournalEntry] = useState(initialValue);

  const handleSave = () => {
    onSave(journalEntry);
    onClose();
  };

  const handleCancel = () => {
    setJournalEntry(initialValue);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card border-4 border-accent">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Flyback Journal
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Reflect on your experience with <span className="font-semibold text-foreground">{toolName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="What did you discover? How did this tool affect your work? What insights emerged?"
            className="min-h-[300px] text-base resize-none focus-visible:ring-2 focus-visible:ring-accent"
            data-testid="textarea-journal-entry"
          />
          <p className="text-xs text-muted-foreground">
            Your reflections will be saved with this draw and visible in your history.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            data-testid="button-cancel-journal"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            data-testid="button-save-journal"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Save Reflection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
