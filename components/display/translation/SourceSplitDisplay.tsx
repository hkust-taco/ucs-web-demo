import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  SourceBranch,
  SourcePattern,
  SourceSplit,
} from "@mlscript/ucs-demo-build";
import { EllipsisIcon } from "lucide-react";
import { Fragment, ReactNode, useState } from "react";
import {
  Connective,
  EmptySplitNode,
  SingleElseSplitNode,
  SplitClosingNode,
  SplitOpeningNode,
  TermNode,
} from "./nodes";
import { StageSection } from "./StageSection";

export type ParsingContentProps = {
  caption: ReactNode;
  topLevelSplit: SourceSplit;
};

export function SourceSplitDisplay({
  caption,
  topLevelSplit,
}: ParsingContentProps) {
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
  split: SourceSplit;
  connective?: boolean;
};

function SplitNode({ prefix, split, connective = false }: SplitNodeProps) {
  const [splitOpen, setSplitOpen] = useState(true);
  return (
    <>
      <div>
        {prefix}
        {split.type === "Nil" ? (
          <EmptySplitNode />
        ) : split.type === "Else" ? (
          <SingleElseSplitNode split={split} style="source" />
        ) : (
          <div className="inline-flex flex-row items-center">
            {connective ? <Connective>and</Connective> : null}
            <SplitOpeningNode open={splitOpen} onOpenChange={setSplitOpen} />
            {splitOpen ? null : (
              <>
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

function NestedSplitNode({ split }: { split: SourceSplit }) {
  const elements: ReactNode[] = [];
  let current = split as SourceSplit;
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
        <div key={index}>
          <span>let {name} = </span>
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

function BranchNode({ branch }: { branch: SourceBranch }) {
  switch (branch.type) {
    case "OperatorBranch.Binary":
    case "OperatorBranch.Match":
      return (
        <SplitNode
          prefix={<span className="font-mono">{branch.operator}</span>}
          split={branch.continuation}
        />
      );
    case "PatternBranch.Pattern":
      return (
        <SplitNode
          prefix={<PatternNode pattern={branch.pattern} />}
          split={branch.continuation}
          connective
        />
      );
    case "TermBranch.Boolean":
      return (
        <SplitNode
          prefix={<TermNode term={branch.test} tooltip="Boolean test" />}
          split={branch.continuation}
          connective
        />
      );
    case "TermBranch.Left":
      return (
        <SplitNode
          prefix={
            <TermNode term={branch.left} tooltip="Conditional split LHS" />
          }
          split={branch.continuation}
        />
      );
    case "TermBranch.Match":
      return (
        <SplitNode
          prefix={
            <>
              <TermNode term={branch.scrutinee} tooltip="Scrutinee" />
              <span className="font-mono font-bold mx-2">is</span>
            </>
          }
          split={branch.continuation}
        />
      );
  }
}

function PatternNode({ pattern }: { pattern: SourcePattern }) {
  switch (pattern.type) {
    case "Alias":
      return (
        <>
          <PatternNode pattern={pattern.pattern} />
          <span className="font-bold">as</span>
          <span className="font-mono">{pattern.name}</span>
        </>
      );
    case "Class":
      return (
        <span className="pl-1 pr-0.5 py-px bg-black/10 rounded-sm">
          {pattern.refined ? <span className="font-bold">refined</span> : null}
          <span className="font-mono">{pattern.name}</span>
          {pattern.parameters === undefined ? null : (
            <>
              <span className="font-mono">{"("}</span>
              {pattern.parameters.map((field, i, parameters) => (
                <Fragment key={i}>
                  <PatternNode pattern={field} />
                  {i === parameters.length - 1 ? null : <span>{", "}</span>}
                </Fragment>
              ))}
              <span className="font-mono">{")"}</span>
            </>
          )}
        </span>
      );
    case "Concrete":
      return <span className="font-mono">{pattern.name}</span>;
    case "Empty":
      return <span>{"_"}</span>;
    case "Literal":
      return <span className="font-mono">{pattern.literal.term}</span>;
    case "Name":
      return <span className="font-mono">{pattern.name}</span>;
    case "Record":
      return (
        <>
          <span>{"{"}</span>
          {pattern.fields.map((field, i, fields) => (
            <Fragment key={i}>
              <span className="font-mono">{field.name}</span>
              <span>{": "}</span>
              <PatternNode pattern={field.pattern} />
              {i === fields.length - 1 ? null : <span>{", "}</span>}
            </Fragment>
          ))}
          <span>{"}"}</span>
        </>
      );
    case "Tuple":
      return (
        <>
          <span>{"("}</span>
          {pattern.fields.map((field, i, fields) => (
            <Fragment key={i}>
              <PatternNode pattern={field} />
              {i === fields.length - 1 ? null : <span>{", "}</span>}
            </Fragment>
          ))}
          <span>{")"}</span>
        </>
      );
  }
}
