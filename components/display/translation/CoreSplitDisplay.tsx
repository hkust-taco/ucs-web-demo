import { splitLength } from "@/lib/utils/splitUtils";
import { CoreBranch, CorePattern, CoreSplit } from "@mlscript/ucs-demo-build";
import { EllipsisIcon } from "lucide-react";
import pluralize from "pluralize";
import { ReactNode, useMemo, useState } from "react";
import { StageSection } from "./StageSection";
import {
  Connective,
  EmptySplitNode,
  Keyword,
  SingleElseSplitNode,
  Space,
  SplitClosingNode,
  SplitOpeningNode,
  TermNode,
} from "./nodes";

export type CoreSplitDisplayProps = {
  caption: ReactNode;
  topLevelSplit: CoreSplit;
};

export function CoreSplitDisplay({
  caption,
  topLevelSplit,
}: CoreSplitDisplayProps) {
  return (
    <StageSection caption={caption}>
      <SplitNode
        prefix={<span className="font-mono font-medium mr-2">if</span>}
        split={topLevelSplit}
      />
    </StageSection>
  );
}

type SplitNodeProps = {
  prefix?: ReactNode;
  split: CoreSplit;
  connective?: boolean;
};

function SplitNode({ prefix, split, connective = false }: SplitNodeProps) {
  const [splitOpen, setSplitOpen] = useState(true);
  const length = useMemo(() => splitLength(split), [split]);
  return (
    <>
      <div className="font-mono">
        {prefix}
        {split.type === "Nil" ? (
          <EmptySplitNode />
        ) : split.type === "Else" ? (
          <SingleElseSplitNode split={split} style="core" />
        ) : (
          <div className="inline-flex flex-row items-center">
            {connective ? <Connective>{"->"}</Connective> : null}
            <SplitOpeningNode open={splitOpen} onOpenChange={setSplitOpen} />
            {splitOpen ? null : (
              <>
                <span className="ml-1 text-sm select-none font-semibold">
                  {pluralize("item", length, true)}
                </span>
                <EllipsisIcon className="mx-1 w-4 h-4" />
                <SplitClosingNode
                  open={splitOpen}
                  onOpenChange={setSplitOpen}
                />
              </>
            )}
          </div>
        )}
      </div>
      {split.type !== "Nil" && split.type !== "Else" && splitOpen ? (
        <>
          <NestedSplitNode split={split} />
          <SplitClosingNode open={splitOpen} onOpenChange={setSplitOpen} />
        </>
      ) : null}
    </>
  );
}

function NestedSplitNode({ split }: { split: CoreSplit }) {
  const elements: ReactNode[] = [];
  let current = split as CoreSplit;
  let index = 0;
  while (true) {
    if (current.type === "Cons") {
      const { head, tail } = current;
      elements.push(<BranchNode key={index} branch={head} />);
      current = tail;
      index += 1;
    } else if (current.type === "Let") {
      const { rec, name, rhs, tail } = current;
      elements.push(
        <div className="font-mono" key={index}>
          <span className="font-bold">let</span>
          <span> {name} </span>
          <span className="font-bold">= </span>
          <TermNode term={rhs} tooltip="Let binding RHS" />
        </div>
      );
      current = tail;
      index += 1;
    } else if (current.type === "Else") {
      const { term } = current;
      elements.push(
        <div key={index}>
          <span className="font-mono font-bold mr-2">else</span>
          <TermNode term={term} tooltip="Default term" />
        </div>
      );
      break;
    } else {
      break;
    }
  }
  return (
    <div className="relative ml-4">
      <div className="absolute top-0 left-0 bottom-0 w-px bg-border -translate-x-4" />
      {elements}
    </div>
  );
}

function BranchNode({ branch }: { branch: CoreBranch }) {
  return (
    <SplitNode
      prefix={
        <>
          <span className="font-mono">{branch.scrutinee}</span>
          <Space />
          <Keyword>is</Keyword>
          <Space />
          <PatternNode pattern={branch.pattern} />
        </>
      }
      split={branch.continuation}
      connective
    />
  );
}

function PatternNode({ pattern }: { pattern: CorePattern }) {
  switch (pattern.type) {
    case "Class":
      return (
        <span className="pl-1 pr-0.5 py-px bg-black/10 dark:bg-white/15 rounded-sm">
          {pattern.originallyRefined ? (
            <span className="font-bold">refined</span>
          ) : null}
          <span className="font-mono">{pattern.name}</span>
        </span>
      );
    case "Literal":
      return <span className="font-mono">{pattern.literal.term}</span>;
    case "Name":
      return <span className="font-mono">{pattern.name}</span>;
  }
}
