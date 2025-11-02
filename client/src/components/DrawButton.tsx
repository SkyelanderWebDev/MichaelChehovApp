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
      className={`
        px-12 py-6 text-lg font-bold rounded-xl shadow-lg
        ${isDrawing ? 'animate-pulse' : ''}
      `}
      size="lg"
    >
      <Sparkles className="w-5 h-5 mr-2" />
      {isDrawing ? 'Drawing...' : 'Draw Tool'}
    </Button>
  );
}
