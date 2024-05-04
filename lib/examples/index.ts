import { z } from "zod";
import json from "./JSON.mls";
import zipWith from "./zipWith.mls";
import mapPartition from "./mapPartition.mls";
import binarySearchTree from "./BinarySearchTree.mls";
import calculator from "./Calculator.mls";
import lispInterpreter from "./LispInterpreter.mls";
import variousSplits from "./variousSplits.mls";
import split2 from "./split-2.mls";
import sign from "./sign.mls";
import guards from "./guards.mls";

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
