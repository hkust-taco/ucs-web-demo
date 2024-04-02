import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MLscriptTerm } from "@mlscript/ucs-demo-build";
import { ReactNode, useCallback } from "react";

export type TermNodeProps = {
  term: MLscriptTerm;
  tooltip?: ReactNode;
};

export function TermNode({ term, tooltip }: TermNodeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-mono text-primary/85 underline underline-offset-4 truncate">
            {term.term}
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltip ?? <p>Term</p>}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function Connective({ children }: { children: ReactNode }) {
  return (
    <span className="mx-2 font-mono font-bold text-muted-foreground">
      {children}
    </span>
  );
}

export type SplitBraceProps = {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
};

export function SplitOpeningNode({
  open = true,
  onOpenChange,
}: SplitBraceProps) {
  const onClick = useCallback(
    () => onOpenChange?.(!open),
    [open, onOpenChange]
  );
  return (
    <button
      className="font-mono text-muted-foreground -mx-0.5 px-0.5 py-px hover:bg-black/10 rounded-sm"
      type="button"
      onClick={onClick}
    >
      {"{"}
    </button>
  );
}

export function SplitClosingNode({ open, onOpenChange }: SplitBraceProps) {
  const onClick = useCallback(
    () => onOpenChange?.(!open),
    [open, onOpenChange]
  );
  return (
    <button
      className="font-mono text-muted-foreground -mx-0.5 px-0.5 py-px hover:bg-black/10 rounded-sm"
      type="button"
      onClick={onClick}
    >
      {"}"}
    </button>
  );
}

export function EmptySplitNode() {
  return (
    <span className="font-mono">
      {"{"}
      <span className="text-muted-foreground mx-2 italic">empty</span>
      {"}"}
    </span>
  );
}

export type ElseStyle = "source" | "core" | "core-shorthands";

export type SingleElseSplitNodeProps = {
  split: { type: "Else"; term: MLscriptTerm };
  style: ElseStyle;
};

export function SingleElseSplitNode({
  split,
  style,
}: SingleElseSplitNodeProps) {
  const { term } = split;
  return (
    <>
      {style === "source" ? (
        <Connective>then</Connective>
      ) : style === "core" ? (
        <Connective>{"->"}</Connective>
      ) : null}
      <TermNode term={term} tooltip="Consequent" />
    </>
  );
}

export function IndentedBlock({ children }: { children: ReactNode }) {
  return (
    <div className="relative ml-4">
      <div className="absolute top-0 left-0 bottom-0 w-px bg-border -translate-x-4" />
      {children}
    </div>
  );
}
