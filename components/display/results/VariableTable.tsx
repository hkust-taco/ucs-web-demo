import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  BracesIcon,
  BracketsIcon,
  CircleSlash2Icon,
  CircleSlashIcon,
  HashIcon,
  KeyRoundIcon,
  LucideIcon,
  PowerIcon,
  QuoteIcon,
  SigmaIcon,
  SquareFunctionIcon,
} from "lucide-react";
import pluralize from "pluralize";
import type { JavaScriptType } from "./types";

export type EvaluatedVariable = {
  name: string;
  type: JavaScriptType;
  inspection: string;
};

export type VariableTablePropsProps = {
  className?: string;
  variables: EvaluatedVariable[];
};

const IMMEDIATE_NAME = "<immediate>";

export function VariableTable({
  className,
  variables,
}: VariableTablePropsProps) {
  return (
    <ScrollArea className={cn("w-full h-full", className)}>
      <Table className="border border-border">
        {/* <TableCaption>A list of evaluated variables.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Variable</TableHead>
            <TableHead>JavaScript Type</TableHead>
            <TableHead>String Representation of Value</TableHead>
            {/* <TableHead className="text-right">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {variables.map((variable) => {
            const Icon = typeIconMap[variable.type];
            return (
              <TableRow key={variable.name}>
                <TableCell className="font-medium">
                  <code
                    className={cn(
                      "font-mono",
                      variable.name === IMMEDIATE_NAME
                        ? "text-muted-foreground"
                        : "text-primary"
                    )}
                  >
                    {variable.name}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center text-muted-foreground">
                    <Icon className="w-4 h-4 mr-1" />
                    <span className="font-medium">{variable.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-full text-sm">
                    <code className="font-mono">{variable.inspection}</code>
                  </div>
                </TableCell>
                {/* <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell colSpan={1} className="text-right">
              {pluralize("variable", variables.length, true)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </ScrollArea>
  );
}

const typeIconMap: Record<JavaScriptType, LucideIcon> = {
  string: QuoteIcon,
  number: HashIcon,
  boolean: PowerIcon,
  object: BracesIcon,
  bigint: SigmaIcon,
  function: SquareFunctionIcon,
  symbol: KeyRoundIcon,
  undefined: CircleSlashIcon,
  array: BracketsIcon,
  null: CircleSlash2Icon,
};
