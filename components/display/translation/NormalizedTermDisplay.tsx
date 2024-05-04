import {
  NormalizedTerm,
  NormalizedTermCase,
  NormalizedTermCasePattern,
} from "@mlscript/ucs-demo-build";
import { EllipsisIcon } from "lucide-react";
import pluralize from "pluralize";
import { ReactNode, useMemo, useState } from "react";
import { StageSection } from "./StageSection";
import {
  Connective,
  EmptySplitNode,
  IndentedBlock,
  SplitClosingNode,
  SplitOpeningNode,
  TermNode,
} from "./nodes";

export type NormalizedTermDisplayProps = {
  caption: ReactNode;
  topLevelTerm: NormalizedTerm;
};

export function NormalizedTermDisplay({
  caption,
  topLevelTerm,
}: NormalizedTermDisplayProps) {
  return (
    <StageSection caption={caption}>
      <NormalizedTermNode term={topLevelTerm} topLevel />
    </StageSection>
  );
}

type NormalizedTermNodeProps = {
  term: NormalizedTerm;
  topLevel?: boolean;
};

function NormalizedTermNode({
  term,
  topLevel = false,
}: NormalizedTermNodeProps) {
  const elements: ReactNode[] = [];
  let current = term as NormalizedTerm;
  while (current.type === "Let") {
    elements.push(
      <div key={elements.length}>
        <span className="font-mono font-bold">let</span>
        <span className="mx-2 font-mono text-muted-foreground underline decoration-muted-foreground underline-offset-4">
          {current.name}
        </span>
        <span className="font-mono font-bold">= </span>
        <NormalizedTermNode term={current.rhs} />
      </div>
    );
    current = current.body;
  }
  if (current.type === "CaseOf") {
    elements.push(
      <div>
        <CaseOfNode
          prefix={
            <>
              <span className="font-mono font-bold mr-2">case</span>
              <TermNode term={current.scrutinee} />
              <span className="font-mono font-bold mx-2">of</span>
            </>
          }
          cases={current.cases}
        />
      </div>
    );
  } else {
    elements.push(<TermNode term={current} />);
  }
  return elements.length === 1 && (term.type === "Term" || topLevel) ? (
    elements[0]
  ) : (
    <IndentedBlock>{elements}</IndentedBlock>
  );
}

type CaseOfNodeProps = {
  prefix?: ReactNode;
  cases: NormalizedTermCase;
};

function CaseOfNode({ prefix, cases }: CaseOfNodeProps) {
  const [caseOpen, setCaseOpen] = useState(true);
  const length = useMemo(() => {
    let t = cases;
    let n = 0;
    while (true) {
      if (t.type === "Case") {
        n += 1;
        t = t.tail;
      } else if (t.type === "Wildcard") {
        n += 1;
        break;
      } else {
        break;
      }
    }
    return n;
  }, [cases]);
  return (
    <>
      <div>
        {prefix}
        {cases.type === "NoCases" ? (
          <EmptySplitNode />
        ) : (
          <div className="inline-flex flex-row items-center">
            <SplitOpeningNode open={caseOpen} onOpenChange={setCaseOpen} />
            {caseOpen ? null : (
              <>
                <span className="ml-1 text-sm select-none font-semibold">
                  {pluralize("item", length, true)}
                </span>
                <EllipsisIcon className="mx-1 w-4 h-4" />
                <SplitClosingNode open={caseOpen} onOpenChange={setCaseOpen} />
              </>
            )}
          </div>
        )}
      </div>
      {cases.type !== "NoCases" && cases.type !== "Wildcard" && caseOpen ? (
        <>
          <NestedSplitNode cases={cases} />
          <SplitClosingNode open={caseOpen} onOpenChange={setCaseOpen} />
        </>
      ) : null}
    </>
  );
}

function NestedSplitNode({ cases }: { cases: NormalizedTermCase }) {
  const elements: ReactNode[] = [];
  let current = cases;
  let index = 0;
  while (true) {
    if (current.type === "Case") {
      const { refined, pattern, rhs, tail } = current;
      elements.push(
        <div key={index} className="">
          <PatternNode refined={refined} pattern={pattern} />
          <Connective>{"->"}</Connective>
          <NormalizedTermNode term={rhs} />
        </div>
      );
      current = tail;
      index += 1;
    } else if (current.type === "Wildcard") {
      const { term } = current;
      elements.push(
        <div key={index}>
          <span className="font-mono font-bold">_</span>
          <Connective>{"->"}</Connective>
          <NormalizedTermNode term={term} />
        </div>
      );
      break;
    } else {
      break;
    }
  }
  return <IndentedBlock>{elements}</IndentedBlock>;
}

function PatternNode({
  refined,
  pattern,
}: {
  refined: boolean;
  pattern: NormalizedTermCasePattern;
}) {
  switch (pattern.type) {
    case "Constructor":
      return (
        <span className="pl-1 pr-0.5 py-px bg-black/10 rounded-sm">
          {refined ? <span className="font-bold">refined</span> : null}
          <span className="font-mono">{pattern.name}</span>
        </span>
      );
    case "Other":
      return <TermNode term={pattern.term} />;
  }
}
