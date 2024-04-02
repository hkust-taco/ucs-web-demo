import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Source } from "@/lib/source";
import { type Compilation } from "@mlscript/ucs-demo-build";
import { InfoIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";
import { CoreSplitDisplay } from "./CoreSplitDisplay";
import { NormalizedTermDisplay } from "./NormalizedTermDisplay";
import { SourceSplitDisplay } from "./SourceSplitDisplay";
import { StageDisplay } from "./StageDisplay";

export type TranslationContentProps = {
  sourceCode: string | null;
  compilation: Compilation | null;
};

export function TranslationContent({
  sourceCode,
  compilation,
}: TranslationContentProps) {
  const source = useMemo(
    () => (sourceCode === null ? null : new Source(sourceCode)),
    [sourceCode]
  );
  const translationResultList = useMemo(() => {
    if (!compilation?.translation) return [];
    console.log("Updated", compilation?.translation);
    return (
      compilation?.translation?.content?.map((translateResult) => ({
        id: nanoid(),
        location:
          translateResult.locations === undefined || source === null
            ? undefined
            : [
                source.lookup(translateResult.locations[0]),
                source.lookup(translateResult.locations[1]),
              ],
        source:
          typeof sourceCode === "string" &&
          translateResult.locations !== undefined
            ? sourceCode.slice(...translateResult.locations)
            : null,
        transformed: translateResult.transformed,
        desugared: translateResult.desugared,
        normalized: translateResult.normalized,
        postProcessed: translateResult.postProcessed,
      })) ?? []
    );
  }, [source, compilation?.translation]);
  useEffect(() => {
    setSelectedTranslationResultId(
      translationResultList.length === 0
        ? undefined
        : translationResultList[0].id
    );
  }, [translationResultList]);
  const [selectedTranslationResultId, setSelectedTranslationResultId] =
    useState<string | undefined>(undefined);
  const selectedTranslationResult = useMemo(() => {
    return translationResultList.find(
      (result) => result.id === selectedTranslationResultId
    );
  }, [selectedTranslationResultId, translationResultList]);
  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 px-1">
        {translationResultList.length === 0 ? (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>No Translation Results</AlertTitle>
            <AlertDescription>
              Click &ldquo;Compile & Run&rdquo; button to see the translation
              stages. If there are multiple UCS expressions, select the one you
              want to see in the dropdown.
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="flex flex-row gap-4 items-center">
          <Label className="flex-shrink-0">Show UCS term</Label>
          <Select
            value={selectedTranslationResultId}
            onValueChange={setSelectedTranslationResultId}
          >
            <SelectTrigger className="flex-grow">
              <SelectValue
                id="run"
                className="select-none"
                placeholder="Please select a run to display the variable's results in the table below."
              />
            </SelectTrigger>
            <SelectContent>
              {translationResultList.map((translationResult) => (
                <SelectItem
                  key={translationResult.id}
                  value={translationResult.id}
                >
                  from{" "}
                  <LocationDisplay
                    location={translationResult?.location?.[0]}
                  />{" "}
                  to{" "}
                  <LocationDisplay
                    location={translationResult?.location?.[1]}
                  />
                </SelectItem>
              ))}
              {translationResultList.length === 0 ? (
                <SelectItem value="null" disabled>
                  No UCS expressions to show.
                </SelectItem>
              ) : null}
            </SelectContent>
          </Select>
        </div>
        {selectedTranslationResult === undefined ? undefined : (
          <>
            <StageDisplay
              caption="Source Code"
              lines={selectedTranslationResult.source?.split("\n") ?? []}
            />
            <SourceSplitDisplay
              caption="Stage 0: Parsing"
              topLevelSplit={selectedTranslationResult.transformed}
            />
            <CoreSplitDisplay
              caption="Stage 1: Desugaring"
              topLevelSplit={selectedTranslationResult.desugared}
            />
            <NormalizedTermDisplay
              caption="Stage 2: Normalization"
              topLevelTerm={selectedTranslationResult.normalized}
            />
            <NormalizedTermDisplay
              caption="Stage 3: Post-processing"
              topLevelTerm={selectedTranslationResult.postProcessed}
            />
          </>
        )}
      </div>
    </ScrollArea>
  );
}

type LocationDisplayProps = {
  location: [line: number, column: number] | null | undefined;
};

function LocationDisplay({ location }: LocationDisplayProps) {
  return location ? (
    <span className="font-semibold underline underline-offset-2">
      ln {location[0]} col {location[1]}
    </span>
  ) : (
    <span className="text-muted-foreground">unknown location</span>
  );
}
