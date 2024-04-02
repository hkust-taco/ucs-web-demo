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
      className="p-4 w-full h-full flex flex-col gap-4"
    >
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
      <TabsContent className="mt-0 flex-grow min-h-0" value="translation">
        <TranslationContent sourceCode={source} compilation={compilation} />
      </TabsContent>
      <TabsContent className="mt-0 flex-grow min-h-0" value="types">
        <TypeInferenceContent types={compilation?.types.content ?? null} />
      </TabsContent>
      <TabsContent className="mt-0 flex-grow min-h-0" value="results">
        <EvaluationResult />
      </TabsContent>
    </Tabs>
  );
}
