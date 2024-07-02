import { z } from "zod";
import json from "./JSON.mls?raw";
import zipWith from "./zipWith.mls?raw";
import mapPartition from "./mapPartition.mls?raw";
import binarySearchTree from "./BinarySearchTree.mls?raw";
import calculator from "./Calculator.mls?raw";
import lispInterpreter from "./LispInterpreter.mls?raw";
import variousSplits from "./variousSplits.mls?raw";
import split2 from "./split-2.mls?raw";
import sign from "./sign.mls?raw";
import guards from "./guards.mls?raw";

export const ExampleSchema = z.object({
  group: z.string().default("user"),
  name: z.string(),
  description: z.string().default(""),
  source: z.string().default(""),
  builtin: z.boolean().default(false),
});

export type Example = z.output<typeof ExampleSchema>;

export const advancedExamples: Example[] = [
  {
    group: "Real-World Examples",
    name: "JSON Parser",
    description: "A full-fledged JSON parser.",
    source: json,
    builtin: true,
  },
  {
    group: "Real-World Examples",
    name: "Binary Search Tree",
    description: "A binary search tree implementation.",
    source: binarySearchTree,
    builtin: true,
  },
  {
    group: "Real-World Examples",
    name: "Calculator",
    description: "A calculator of arithmetic expressions",
    source: calculator,
    builtin: true,
  },
  {
    group: "Real-World Examples",
    name: "Lisp Interpreter",
    description: "A simple Lisp interpreter.",
    source: lispInterpreter,
    builtin: true,
  },
];

export const basicExamples: Example[] = [
  {
    group: "Section 1",
    name: "conditional splits – 1",
    description: "The first example in the paper.",
    source: variousSplits,
    builtin: true,
  },
  {
    group: "Section 1",
    name: "conditional splits – 2",
    description: "The second example in the paper.",
    source: split2,
    builtin: true,
  },
  {
    group: "General",
    name: "guards",
    description:
      "This example shows how UCS can easily achieve pattern matching guards.",
    source: guards,
    builtin: true,
  },
  {
    group: "General",
    name: "sign",
    description: "Determine the sign of a number with operator splits of UCS.",
    source: sign,
    builtin: true,
  },
  {
    group: "List",
    name: "mapPartition",
    description: "An implementation of `mapPartition` function on lists.",
    source: mapPartition,
    builtin: true,
  },
  {
    group: "List",
    name: "zipWith",
    description: "An implementation of `zipWith` function on lists.",
    source: zipWith,
    builtin: true,
  },
];

export const examples: Example[] = [...basicExamples, ...advancedExamples];
