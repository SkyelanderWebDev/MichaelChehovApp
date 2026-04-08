import { useState, useEffect } from "react";
import { DrawnTool, type DbJournalEntry } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sun, CloudSun, Moon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface POAJournalProps {
  isOpen: boolean;
  onClose: () => void;
  drawnTool: DrawnTool;
}

interface JournalFormData {
  practiceNotes: string;
  observeMorning: string;
  observeMidday: string;
  observeEvening: string;
  applyMorning: string;
  applyMidday: string;
  applyEvening: string;
  journalText: string;
}

const emptyForm: JournalFormData = {
  practiceNotes: "",
  observeMorning: "",
  observeMidday: "",
  observeEvening: "",
  applyMorning: "",
  applyMidday: "",
  applyEvening: "",
  journalText: "",
};

export default function POAJournal({ isOpen, onClose, drawnTool }: POAJournalProps) {
  const [mode, setMode] = useState<"structured" | "journal">("structured");
  const [form, setForm] = useState<JournalFormData>(emptyForm);
  const [existingEntryId, setExistingEntryId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load existing journal entries for this drawn tool
  const { data: entries = [] } = useQuery<DbJournalEntry[]>({
    queryKey: ["/api/journal", drawnTool.id],
    queryFn: async () => {
      const res = await fetch(`/api/journal/${drawnTool.id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: isOpen,
  });

  // Populate form when entries load
  useEffect(() => {
    if (entries.length > 0) {
      const entry = entries[0];
      setExistingEntryId(entry.id);
      setMode(entry.mode as "structured" | "journal");
      setForm({
        practiceNotes: entry.practiceNotes || "",
        observeMorning: entry.observeMorning || "",
        observeMidday: entry.observeMidday || "",
        observeEvening: entry.observeEvening || "",
        applyMorning: entry.applyMorning || "",
        applyMidday: entry.applyMidday || "",
        applyEvening: entry.applyEvening || "",
        journalText: entry.journalText || "",
      });
    } else {
      setExistingEntryId(null);
      setForm(emptyForm);
    }
  }, [entries]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const payload = {
        mode,
        drawnToolId: drawnTool.id,
        date: today,
        practiceNotes: form.practiceNotes || null,
        observeMorning: form.observeMorning || null,
        observeMidday: form.observeMidday || null,
        observeEvening: form.observeEvening || null,
        applyMorning: form.applyMorning || null,
        applyMidday: form.applyMidday || null,
        applyEvening: form.applyEvening || null,
        journalText: form.journalText || null,
      };

      if (existingEntryId) {
        const res = await apiRequest("PATCH", `/api/journal/${existingEntryId}`, payload);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/journal", {
          ...payload,
          id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        });
        return res.json();
      }
    },
    onSuccess: (data) => {
      setExistingEntryId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/journal", drawnTool.id] });
      toast({
        title: "Journal saved",
        description: "Your POA practice notes have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save journal entry.",
        variant: "destructive",
      });
    },
  });

  const updateField = (field: keyof JournalFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-4 border-accent">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            POA Practice Journal
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Daily practice with{" "}
            <Badge variant="secondary" className="text-sm px-2 py-0.5 bg-accent/20 text-accent-foreground border border-accent">
              {drawnTool.parentToolName}
            </Badge>
            {drawnTool.categoryName && (
              <span className="text-muted-foreground"> from {drawnTool.categoryName}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Mode toggle */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <Label htmlFor="poa-mode" className="text-sm font-semibold text-foreground">
            {mode === "structured" ? "Structured Mode" : "Journal Mode"}
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Structured</span>
            <Switch
              id="poa-mode"
              checked={mode === "journal"}
              onCheckedChange={(checked) => setMode(checked ? "journal" : "structured")}
              data-testid="switch-poa-mode"
            />
            <span className="text-xs text-muted-foreground">Journal</span>
          </div>
        </div>

        {mode === "structured" ? (
          <div className="space-y-6 py-2">
            {/* Practice section */}
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <Label className="text-base font-bold text-primary">Practice</Label>
                <span className="text-xs text-muted-foreground">5 minutes of physical exploration</span>
              </div>
              <Textarea
                value={form.practiceNotes}
                onChange={(e) => updateField("practiceNotes", e.target.value)}
                placeholder="What movements, images, or qualities did you explore?"
                className="min-h-[100px] resize-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                data-testid="textarea-practice"
              />
            </section>

            {/* Observe section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <Label className="text-base font-bold text-primary">Observe</Label>
                <span className="text-xs text-muted-foreground">1 min x 3 — notice without intent</span>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Morning
                  </Label>
                  <Textarea
                    value={form.observeMorning}
                    onChange={(e) => updateField("observeMorning", e.target.value)}
                    placeholder="What did you notice naturally?"
                    className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    data-testid="textarea-observe-morning"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-amber-500" /> Midday
                  </Label>
                  <Textarea
                    value={form.observeMidday}
                    onChange={(e) => updateField("observeMidday", e.target.value)}
                    placeholder="What did you notice naturally?"
                    className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    data-testid="textarea-observe-midday"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-amber-500" /> Evening
                  </Label>
                  <Textarea
                    value={form.observeEvening}
                    onChange={(e) => updateField("observeEvening", e.target.value)}
                    placeholder="What did you notice naturally?"
                    className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    data-testid="textarea-observe-evening"
                  />
                </div>
              </div>
            </section>

            {/* Apply section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <Label className="text-base font-bold text-primary">Apply</Label>
                <span className="text-xs text-muted-foreground">1 min x 3 — consciously use the tool</span>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-emerald-500" /> Morning
                  </Label>
                  <Textarea
                    value={form.applyMorning}
                    onChange={(e) => updateField("applyMorning", e.target.value)}
                    placeholder="How did you consciously use this tool?"
                    className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                    data-testid="textarea-apply-morning"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-emerald-500" /> Midday
                  </Label>
                  <Textarea
                    value={form.applyMidday}
                    onChange={(e) => updateField("applyMidday", e.target.value)}
                    placeholder="How did you consciously use this tool?"
                    className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                    data-testid="textarea-apply-midday"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-emerald-500" /> Evening
                  </Label>
                  <Textarea
                    value={form.applyEvening}
                    onChange={(e) => updateField("applyEvening", e.target.value)}
                    placeholder="How did you consciously use this tool?"
                    className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                    data-testid="textarea-apply-evening"
                  />
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="py-2">
            <Textarea
              value={form.journalText}
              onChange={(e) => updateField("journalText", e.target.value)}
              placeholder="Write freely about your practice with this tool today..."
              className="min-h-[300px] text-base resize-none focus-visible:ring-2 focus-visible:ring-accent"
              data-testid="textarea-journal-freeform"
            />
          </div>
        )}

        {/* Sticky save button */}
        <div className="sticky bottom-0 pt-3 pb-1 bg-card border-t border-border -mx-6 px-6">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full py-6 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
            data-testid="button-save-poa"
          >
            <Save className="w-5 h-5 mr-2" />
            {saveMutation.isPending ? "Saving..." : existingEntryId ? "Update Practice Notes" : "Save Practice Notes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
