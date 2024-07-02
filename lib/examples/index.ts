import { z } from "zod";
// import json from "./JSON.mls?raw";
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
  source: z.string().default(""),
  builtin: z.boolean().default(false),
});

export type Example = z.output<typeof ExampleSchema>;

export const examples: Example[] = [
  {
    group: "Section 1",
    name: "conditional splits (1)",
    source: variousSplits,
    builtin: true,
  },
  {
    group: "Section 1",
    name: "conditional splits (2)",
    source: split2,
    builtin: true,
  },
  {
    group: "General",
    name: "guards",
    source: guards,
    builtin: true,
  },
  {
    group: "General",
    name: "sign",
    source: sign,
    builtin: true,
  },
  {
    group: "List",
    name: "mapPartition",
    source: mapPartition,
    builtin: true,
  },
  {
    group: "List",
    name: "zipWith",
    source: zipWith,
    builtin: true,
  },
  // {
  //   group: "Real-World Examples",
  //   name: "JSON Parser",
  //   source: json,
  //   builtin: true,
  // },
  {
    group: "Real-World Examples",
    name: "Binary Search Tree",
    source: binarySearchTree,
    builtin: true,
  },
  {
    group: "Real-World Examples",
    name: "Calculator",
    source: calculator,
    builtin: true,
  },
  {
    group: "Real-World Examples",
    name: "Lisp Interpreter",
    source: lispInterpreter,
    builtin: true,
  },
];
