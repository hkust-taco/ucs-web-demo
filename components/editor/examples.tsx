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

const ExampleFormSchema = z.object({
  example: z.string().min(1, "Name is required"),
});

type ExampleFormData = z.output<typeof ExampleFormSchema>;

export type ExampleLoadFormProps = {
  className?: string;
  onLoad?: (example: Example) => void;
};

export function ExampleLoadForm({ className, onLoad }: ExampleLoadFormProps) {
  const { register, handleSubmit } = useForm<ExampleFormData>({
    resolver: zodResolver(ExampleFormSchema),
  });
  const exampleGroups = useExampleGroups();
  const onSubmit = useCallback((data: z.output<typeof ExampleFormSchema>) => {
    alert(data.example);
  }, []);
  return (
    <form
      className={cn(className, "flex flex-row gap-3 items-center")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Label className="flex-shrink-0" htmlFor="example">
        Example
      </Label>
      <Select>
        <SelectTrigger className="flex-grow">
          <SelectValue
            {...register("example")}
            placeholder="Select an example"
          />
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

function useExampleGroups() {
  const [userExamples, setUserExamples] = useLocalStorage<Example[]>(
    "examples",
    []
  );
  const exampleGroups = useMemo(() => {
    const groups = new Map<string, Example[]>();
    for (const example of builtinExamples) {
      let group = groups.get(example.group);
      if (group === undefined) {
        groups.set(example.group, (group = []));
      }
      group.push(example);
    }
    if (userExamples.length > 0) {
      groups.set("User Examples", userExamples);
    }
    return Array.from(groups.entries());
  }, [userExamples]);
  return exampleGroups;
}
