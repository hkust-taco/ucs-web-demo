import { useCallback, useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "usehooks-ts";
import { Example, examples as builtinExamples } from "@/lib/examples";
import { Control, Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FileInputIcon } from "lucide-react";
import { useAllExamples, useExampleGroups } from "@/lib/examples/hooks";

const ExampleFormSchema = z.object({
  example: z.string().min(1, "Name is required"),
});

type ExampleFormData = z.output<typeof ExampleFormSchema>;

export type ExampleLoadFormProps = {
  className?: string;
  onLoad?: (example: Example) => void;
};

export function ExampleLoadForm({ className, onLoad }: ExampleLoadFormProps) {
  const { control, handleSubmit } = useForm<ExampleFormData>({
    resolver: zodResolver(ExampleFormSchema),
  });
  const allExamples = useAllExamples();
  const exampleGroups = useExampleGroups();
  const onSubmit = useCallback(
    (data: ExampleFormData) => {
      const example = allExamples.find(
        (example) => example.name === data.example
      );
      if (example === undefined) {
        console.error(
          `Example "${data.example}" not found but it should appear in the list.`
        );
      } else {
        onLoad?.(example);
      }
    },
    [allExamples, onLoad]
  );
  return (
    <form
      className={cn(className, "flex flex-row gap-3 items-center")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Label className="flex-shrink-0" htmlFor="example">
        Example
      </Label>
      <Controller
        control={control}
        name="example"
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        )}
      />
      <Button className="flex-shrink-0" type="submit" variant="outline">
        <FileInputIcon className="w-4 h-4 mr-1" />
        <span>Load</span>
      </Button>
    </form>
  );
}

export type ExampleSelectProps = {
  groups: [string, Example[]][];
  control: Control<z.output<typeof ExampleFormSchema>>;
};
