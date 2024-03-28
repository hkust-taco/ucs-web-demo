import { ScrollArea } from "@/components/ui/scroll-area";
import { DesugaringContent } from "./desugaring";
import { NormalizationContent } from "./normalization";
import { ParsingContent } from "./parsing";
import { PostProcessingContent } from "./post-processing";
import { CoverageCheckingContent } from "./coverage-checking";
import type { Compilation } from "@mlscript/ucs-demo-build";
import { useMemo } from "react";
import { extractTranslationLogs } from "@/lib/extract";
import { StageDisplay } from "./StageDisplay";

export type TranslationContentProps = {
  compilation: Compilation | null;
};

export function TranslationContent({ compilation }: TranslationContentProps) {
  const logs = useMemo(() => {
    if (compilation === null || compilation.translation.content === undefined)
      return null;
    return extractTranslationLogs(compilation.translation.content);
  }, [compilation]);
  console.log(logs);
  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 px-1">
        <StageDisplay caption="Parsing" lines={logs?.parsing ?? []} />
        <StageDisplay caption="Desugaring" lines={logs?.desugaring ?? []} />
        <StageDisplay caption="Normalization" lines={logs?.normalization ?? []} />
        <StageDisplay caption="Post-processing" lines={logs?.postprocessing ?? []} />
        {/* <ParsingContent />
        <DesugaringContent />
        <NormalizationContent />
        <PostProcessingContent />
        <CoverageCheckingContent /> */}
      </div>
    </ScrollArea>
  );
}
