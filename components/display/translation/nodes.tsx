import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MLscriptTerm } from "@mlscript/ucs-demo-build";
import { ReactNode, useCallback, useState } from "react";

export function Space() {
  return <span className="w-2 font-mono">&nbsp;</span>;
}

export function Keyword({ children }: React.PropsWithChildren<{}>) {
  return <span className="font-mono font-semibold">{children}</span>;
}

export type ConstructorNodeProps = {
  children: ReactNode;
};

export function ConstructorNode({ children }: ConstructorNodeProps) {
  return (
    <span className="pl-1 pr-0.5 py-px bg-black/10 dark:bg-white/15 font-mono rounded-sm">
      {children}
    </span>
  );
}

export type TermNodeProps = {
  term: MLscriptTerm;
  tooltip?: ReactNode;
};

export function TermNode({ term, tooltip }: TermNodeProps) {
  let results: RegExpMatchArray | null = null;
  let content: ReactNode;
  if ((results = term.term.match(/^\((\w+)\)\.unapply\((.+)\)$/))) {
    const [, className, argumentsText] = results;
    content = (
      <span className="font-mono">
        <ConstructorNode>{className}</ConstructorNode>
        <span className="font-semibold">.</span>
        <span className="text-muted-foreground">unapply</span>
        <span className="font-semibold">(</span>
        <span className="text-primary/85 underline underline-offset-4 truncate">
          {argumentsText}
        </span>
        <span className="font-semibold">)</span>
      </span>
    );
  } else if ((results = term.term.match(/^\(([\w\$]+)\)\.(\d+)/))) {
    const [, tupleName, index] = results;
    content = (
      <span className="font-mono">
        <span className="underline underline-offset-4">{tupleName}</span>
        <span className="font-semibold">.</span>
        <span className="font-medium ">{index}</span>
      </span>
    );
  } else {
    content = (
      <span className="font-mono text-primary/85 underline underline-offset-4 truncate">
        {term.term}
      </span>
    );
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>{tooltip ?? <p>Term</p>}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function Connective({ children }: { children: ReactNode }) {
  return (
    <>
      <Space />
      <span className="font-mono font-bold text-muted-foreground">
        {children}
      </span>
      <Space />
    </>
  );
}

export type SplitBraceProps = {
  open?: boolean;
  tag?: string;
  onOpenChange?: (value: boolean) => void;
};

export function SplitOpeningNode({
  open = true,
  tag,
  onOpenChange,
}: SplitBraceProps) {
  const onClick = useCallback(
    () => onOpenChange?.(!open),
    [open, onOpenChange]
  );
  return (
    <button
      className="relative font-mono text-muted-foreground -mx-0.5 px-0.5 py-px hover:bg-black/10 rounded-sm cursor-pointer"
      type="button"
      onClick={onClick}
    >
      {"{"}
      {typeof tag === "string" && open ? (
        <Badge
          className="absolute top-1/2 left-full translate-x-1 -translate-y-1/2 split-type-badge select-none"
          variant="outline"
        >
          {tag}
        </Badge>
      ) : null}
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
  const [isHovered, setIsHovered] = useState(false);
  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => setIsHovered(false), []);
  return (
    <div
      className="relative ml-4 group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={cn(
          "absolute top-0 left-0 bottom-0 w-px bg-border -translate-x-4 transition-colors",
          isHovered ? "bg-muted-foreground" : "bg-border"
        )}
        role="separator"
        aria-hidden
      />
      {children}
    </div>
  );
}
