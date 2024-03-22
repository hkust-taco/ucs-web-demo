import { ScrollArea } from "@/components/ui/scroll-area";
import { DesugaringContent } from "./desugaring";
import { NormalizationContent } from "./normalization";
import { ParsingContent } from "./parsing";
import { PostProcessingContent } from "./post-processing";
import { CoverageCheckingContent } from "./coverage-checking";

export function TranslationContent() {
  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 px-1">
        <ParsingContent />
        <DesugaringContent />
        <NormalizationContent />
        <PostProcessingContent />
        <CoverageCheckingContent />
      </div>
    </ScrollArea>
  );
}
