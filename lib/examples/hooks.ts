import { atomWithLocalStorage } from "@/lib/atom";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { z } from "zod";
import { Example, ExampleSchema, examples } from ".";

const ExampleArraySchema = z.array(ExampleSchema);

const atomUserExamples = atomWithLocalStorage<typeof ExampleArraySchema>(
  "examples",
  ExampleArraySchema,
  []
);

export function useAllExamples() {
  const userExamples = useAtomValue(atomUserExamples);
  return useMemo(() => [...examples, ...userExamples], [userExamples]);
}

export function useAppendExample() {
  const setUserExamples = useSetAtom(atomUserExamples);
  return (example: Example) => {
    setUserExamples((prev) => [...prev, example]);
  };
}

export function useExampleGroups() {
  const allExamples = useAllExamples();
  return useMemo(() => {
    const groups = new Map<string, Example[]>();
    for (const example of allExamples) {
      let group = groups.get(example.group);
      if (group === undefined) {
        groups.set(example.group, (group = []));
      }
      group.push(example);
    }
    return Array.from(groups.entries());
  }, [allExamples]);
}
