import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Source } from "@/lib/utils/source";
import { type Compilation } from "@mlscript/ucs-demo-build";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyContent from "../EmptyContent";
import { CoreSplitDisplay } from "./CoreSplitDisplay";
import { NormalizedTermDisplay } from "./NormalizedTermDisplay";
import { SourceCodeDisplay } from "./SourceCodeDisplay";
import { SourceSplitDisplay } from "./SourceSplitDisplay";
import { CoverageCheckingDisplay } from "./CoverageCheckingDisplay";

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
    const results = (
      compilation?.translation?.content?.map((translateResult) => {
        const location =
          translateResult.locations === undefined || source === null
            ? undefined
            : [
                source.lookup(translateResult.locations[0]),
                source.lookup(translateResult.locations[1]),
              ];
        const excerpt =
          source !== null && location !== undefined
            ? source.slice(
                source.lineStartIndex[location[0][0] - 1],
                translateResult!.locations![1]
              )
            : null;
        return {
          index: 0,
          id: nanoid(),
          location,
          source: excerpt,
          transformed: translateResult.transformed,
          desugared: translateResult.desugared,
          normalized: translateResult.normalized,
          postProcessed: translateResult.postProcessed,
          coverageCheckingResults: translateResult.coverageCheckingResults,
        };
      }) ?? []
    ).sort((a, b) => {
      if (a.location === undefined) return -1;
      if (b.location === undefined) return 1;
      return a.location[0][0] === b.location[0][0]
        ? a.location[0][1] - b.location[0][1]
        : a.location[0][0] - b.location[0][0];
    });
    for (let i = 0; i < results.length; i++) {
      results[i].index = i;
    }
    return results;
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
  const selectPrevious = useCallback(() => {
    const currentIndex = selectedTranslationResult?.index;
    if (currentIndex === undefined) return;
    const nextIndex = currentIndex - 1;
    if (nextIndex < 0) return;
    setSelectedTranslationResultId(translationResultList[nextIndex].id);
  }, [selectedTranslationResult, translationResultList]);
  const selectNext = useCallback(() => {
    const currentIndex = selectedTranslationResult?.index;
    if (currentIndex === undefined) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex >= translationResultList.length) return;
    setSelectedTranslationResultId(translationResultList[nextIndex].id);
  }, [selectedTranslationResult, translationResultList]);
  return (
    <div className="w-full h-full flex flex-col gap-3">
      {translationResultList.length === 0 ? (
        <EmptyContent>
          Please click &ldquo;Compile & Run&rdquo; button to View the
          intermediate results of each stage of UCS translation. These results
          will be displayed in the form of syntax trees. If there are multiple
          UCS expressions, select the one you want to see in the dropdown
          select.
        </EmptyContent>
      ) : (
        <>
          <header className="flex-shrink-0 flex flex-col gap-1.5">
            {/* <SectionDescription>
              You can check here how each UCS term is translated. If there is
              more than one UCS term, you can use the selector below to choose
              the UCS term you want to view.
            </SectionDescription> */}
            {translationResultList.length > 0 ? (
              <div className="flex flex-row gap-4 items-center">
                {/* <Label className="flex-shrink-0">Show UCS term</Label> */}
                <Button
                  className="select-none flex-shrink-0"
                  variant="outline"
                  onClick={selectPrevious}
                  disabled={selectedTranslationResult?.index === 0}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                <Select
                  value={selectedTranslationResultId}
                  onValueChange={setSelectedTranslationResultId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue
                      id="run"
                      className="select-none"
                      placeholder="Please select a UCS expression to show."
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {translationResultList.map(
                      (translationResult, index, list) => (
                        <SelectItem
                          key={translationResult.id}
                          value={translationResult.id}
                        >
                          <span>
                            UCS expression from{" "}
                            <LocationDisplay
                              location={translationResult?.location?.[0]}
                            />{" "}
                            to{" "}
                            <LocationDisplay
                              location={translationResult?.location?.[1]}
                            />
                          </span>
                          <span className="ml-2 text-muted-foreground">
                            ({index + 1} of {list.length})
                          </span>
                        </SelectItem>
                      )
                    )}
                    {translationResultList.length === 0 ? (
                      <SelectItem value="null" disabled>
                        No UCS expressions to show.
                      </SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
                <Button
                  className="select-none flex-shrink-0"
                  variant="outline"
                  onClick={selectNext}
                  disabled={
                    selectedTranslationResult?.index ===
                    translationResultList.length - 1
                  }
                >
                  <span>Next</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </header>
          <ScrollArea className="flex-1 min-h-0">
            <div className="flex flex-col gap-2.5">
              {selectedTranslationResult === undefined ? undefined : (
                <>
                  <SourceCodeDisplay
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
                  <CoverageCheckingDisplay
                    caption="Stage 4: Coverage Checking"
                    diagnostics={
                      selectedTranslationResult.coverageCheckingResults
                    }
                  />
                </>
              )}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}

type LocationDisplayProps = {
  location: [line: number, column: number] | null | undefined;
};

function LocationDisplay({ location }: LocationDisplayProps) {
  return location ? (
    <span className="font-semibold underline underline-offset-2">
      Ln {location[0]} Col {location[1]}
    </span>
  ) : (
    <span className="text-muted-foreground">unknown location</span>
  );
}
