import { useCallback, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Example } from "@/lib/examples";
import { useAllExamples, useExampleGroups } from "@/lib/examples/hooks";
import { cn } from "@/lib/utils/cn";
import { Control } from "react-hook-form";
import { z } from "zod";
import { Label } from "../ui/label";
import { useSetSelectedExample } from "@/lib/store/example";

const ExampleFormSchema = z.object({
  example: z.string().min(1, "Name is required"),
});

export type ExampleLoadFormProps = {
  className?: string;
};

export function ExampleLoadForm({ className }: ExampleLoadFormProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<
    string | undefined
  >();
  const setSelectedExample = useSetSelectedExample();
  const allExamples = useAllExamples();
  const exampleGroups = useExampleGroups();
  const onChange = useCallback(
    (exampleId: string) => {
      setSelectedExampleId(exampleId);
      const example = allExamples.find((example) => example.name === exampleId);
      if (example === undefined) {
        console.error(
          `Example "${exampleId}" not found but it should appear in the list.`
        );
      } else {
        setSelectedExample(example);
      }
    },
    [allExamples, setSelectedExample]
  );
  return (
    <div className={cn(className, "flex flex-row gap-3 items-center")}>
      <Label className="flex-shrink-0" htmlFor="example">
        Select an example
      </Label>
      <Select onValueChange={onChange} value={selectedExampleId}>
        <SelectTrigger className="flex-grow">
          <SelectValue placeholder="Select an example" />
        </SelectTrigger>
        <SelectContent>
          {exampleGroups.map(([group, examples]) => (
            <SelectGroup key={group}>
              <SelectLabel className="text-muted-foreground">
                {group}
              </SelectLabel>
              {examples.map((example) => (
                <SelectItem key={example.name} value={example.name}>
                  {example.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export type ExampleSelectProps = {
  groups: [string, Example[]][];
  control: Control<z.output<typeof ExampleFormSchema>>;
};
