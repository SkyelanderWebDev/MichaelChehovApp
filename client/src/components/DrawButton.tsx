import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface DrawButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isDrawing?: boolean;
}

export default function DrawButton({ onClick, disabled = false, isDrawing = false }: DrawButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      data-testid="button-draw-tool"
      variant="default"
      className={`
        px-16 py-8 text-xl font-bold rounded-2xl shadow-2xl border-2 border-primary-border
        ${isDrawing ? 'animate-pulse' : ''}
        ${disabled ? '' : 'hover:scale-105 active:scale-95'}
      `}
    >
      <Sparkles className="w-6 h-6 mr-3" />
      {isDrawing ? 'Drawing...' : 'Draw Tool'}
    </Button>
  );
}
