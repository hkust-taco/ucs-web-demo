import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compilation } from "@mlscript/ucs-demo-build";
import { RefreshCcwDotIcon, TypeIcon, VariableIcon } from "lucide-react";
import { TypeInferenceContent } from "./inference";
import { EvaluationResult } from "./results";
import { TranslationContent } from "./translation";

export type DisplayPanelContentProps = {
  source: string | null;
  compilation: Compilation | null;
};

export function DisplayPanelContent({
  source,
  compilation,
}: DisplayPanelContentProps) {
  return (
    <Tabs
      defaultValue="translation"
      className="w-full h-full flex flex-col gap-4"
    >
      <div className="w-full h-full flex flex-col">
        <header className="w-full flex-shrink-0 p-4 flex flex-row gap-3 justify-between items-center border-b border-b-border">
          <div className="font-bold text-lg">Compilation Results</div>
          <div className="flex flex-row justify-center">
            <TabsList className="">
              <TabsTrigger value="translation">
                <RefreshCcwDotIcon className="h-4 w-4 mr-1" />
                <span>Translation Stages</span>
              </TabsTrigger>
              <TabsTrigger value="types">
                <TypeIcon className="h-4 w-4 mr-1" />
                <span>Inferred Types</span>
              </TabsTrigger>
              <TabsTrigger value="results">
                <VariableIcon className="h-4 w-4 mr-1" />
                <span>Code Generation</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </header>
        <TabsContent className="mt-0 p-4 flex-grow min-h-0" value="translation">
          <TranslationContent sourceCode={source} compilation={compilation} />
        </TabsContent>
        <TabsContent className="mt-0 p-4 flex-grow min-h-0" value="types">
          <TypeInferenceContent types={compilation?.types ?? null} />
        </TabsContent>
        <TabsContent className="mt-0 p-4 flex-grow min-h-0" value="results">
          <EvaluationResult />
        </TabsContent>
      </div>
    </Tabs>
  );
}
