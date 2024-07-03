import {
  IconArrowsSplit2,
  IconBinaryTree,
  IconFileZip,
  IconPlusMinus,
} from "@tabler/icons-react";
import {
  CalculatorIcon,
  FileJsonIcon,
  FunctionSquareIcon,
  SearchCheckIcon,
  ShieldQuestionIcon,
  SplitIcon,
  TerminalSquareIcon,
  ViewIcon,
} from "lucide-react";
import { ForwardRefExoticComponent } from "react";

export const exampleIconMap = new Map<
  string,
  ForwardRefExoticComponent<{ className?: string }>
>([
  ["various-splits-1", IconArrowsSplit2],
  ["various-splits-2", IconArrowsSplit2],
  ["pair-options", IconArrowsSplit2],
  ["fib", FunctionSquareIcon],
  ["view-pattern", ViewIcon],
  ["guards", ShieldQuestionIcon],
  ["sign", IconPlusMinus],
  ["map-partition", SplitIcon],
  ["zip-with", IconFileZip],
  ["find-first", SearchCheckIcon],
  // Advanced examples
  ["bst", IconBinaryTree],
  ["lisp", TerminalSquareIcon],
  ["calc", CalculatorIcon],
  ["json", FileJsonIcon],
]);
