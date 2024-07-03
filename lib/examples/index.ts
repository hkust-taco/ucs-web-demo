import { z } from "zod";
import json from "./JSON.mls?raw";
import zipWith from "./zipWith.mls?raw";
import mapPartition from "./mapPartition.mls?raw";
import findFirst from "./findFirst.mls?raw";
import binarySearchTree from "./BinarySearchTree.mls?raw";
import calculator from "./Calculator.mls?raw";
import lispInterpreter from "./LispInterpreter.mls?raw";
import variousSplits from "./variousSplits.mls?raw";
import split2 from "./split-2.mls?raw";
import sign from "./sign.mls?raw";
import guards from "./guards.mls?raw";
import ch33PairOptions from "./ch-3-3-pair-options.mls?raw";
import ch51Fib from "./ch-5-1-fib.mls?raw";
import ch51Fig11 from "./ch-5-1-fig-11.mls?raw";

export const ExampleSchema = z.object({
  id: z.string(),
  group: z.string().default("user"),
  name: z.string(),
  description: z.string().default(""),
  source: z.string().default(""),
  builtin: z.boolean().default(false),
  location: z.string().optional(),
});

export type Example = z.output<typeof ExampleSchema>;

export const advancedExamples: Example[] = [
  {
    id: "json",
    group: "Real-World Examples",
    name: "JSON Parser",
    description: "A full-fledged JSON parser.",
    source: json,
    builtin: true,
  },
  {
    id: "bst",
    group: "Real-World Examples",
    name: "Binary Search Tree",
    description: "A binary search tree implementation.",
    source: binarySearchTree,
    builtin: true,
    location: "Fig. 15 in Appendix A",
  },
  {
    id: "calc",
    group: "Real-World Examples",
    name: "Calculator",
    description: "A calculator of arithmetic expressions",
    source: calculator,
    builtin: true,
    location: "Fig. 15 in Appendix A",
  },
  {
    id: "lisp",
    group: "Real-World Examples",
    name: "Lisp Interpreter",
    description: "A simple Lisp interpreter.",
    source: lispInterpreter,
    builtin: true,
  },
];

export const basicExamples: Example[] = [
  {
    id: "various-splits-1",
    group: "Section 1",
    name: "Operator splits",
    description: "This example shows the power of operator splits in UCS.",
    source: variousSplits,
    builtin: true,
    location: "Chapter 1",
  },
  {
    id: "various-splits-2",
    group: "Section 1",
    name: "Pattern splits",
    description:
      "This example shows how to implement nested pattern matching with UCS.",
    source: split2,
    builtin: true,
    location: "Chapter 1",
  },
  {
    id: "pair-options",
    group: "Section 3",
    name: "Double optional values",
    description: "Pattern matching on two optional values.",
    source: ch33PairOptions,
    builtin: true,
    location: "Fig. 5 in Section 3.3",
  },
  {
    id: "guards",
    group: "General",
    name: "Simple pattern guards",
    description:
      "This example shows how UCS can easily achieve pattern matching guards.",
    source: guards,
    builtin: true,
  },
  {
    id: "view-pattern",
    group: "Section 5",
    name: "Expressions and contexts",
    description:
      "The expressions and contexts example compared with Haskell and Scala in Fig. 11.",
    source: ch51Fig11,
    builtin: true,
    location: "Section 5.1",
  },
  {
    id: "fib",
    group: "Section 5",
    name: "Fibonacci function",
    description:
      "The fibonacci function example using view patterns in the paper.",
    source: ch51Fib,
    builtin: true,
    location: "Section 5.1",
  },
  {
    id: "sign",
    group: "General",
    name: "sign",
    description: "Determine the sign of a number with operator splits of UCS.",
    source: sign,
    builtin: true,
  },
  {
    id: "find-first",
    group: "List",
    name: "findFirst",
    description: "An implementation of `findFirst` function on lists.",
    source: findFirst,
    builtin: true,
    location: "Fig. 15 in Appendix A",
  },
  {
    id: "map-partition",
    group: "List",
    name: "mapPartition",
    description: "An implementation of `mapPartition` function on lists.",
    source: mapPartition,
    builtin: true,
    location: "Fig. 15 in Appendix A",
  },
  {
    id: "zip-with",
    group: "List",
    name: "zipWith",
    description: "An implementation of `zipWith` function on lists.",
    source: zipWith,
    builtin: true,
  },
];

export const examples: Example[] = [...basicExamples, ...advancedExamples];
