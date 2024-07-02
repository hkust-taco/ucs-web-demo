import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compilation } from "@mlscript/ucs-demo-build";
import { RefreshCcwDotIcon, TypeIcon, VariableIcon } from "lucide-react";
import { TypeInferenceContent } from "./inference";
import { EvaluationResult } from "./results";
import { TranslationContent } from "./translation";
import { CodeGenerationContent } from "./codegen";

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
      className="w-full h-full flex flex-col gap-3"
    >
      <div className="w-full h-full flex flex-col">
        <header className="w-full flex-shrink-0 pt-3 pb-1.5 px-3 flex flex-row gap-3 justify-center items-center">
          <div className="flex flex-row justify-center">
            <TabsList className="">
              <TabsTrigger value="translation">
                <RefreshCcwDotIcon className="h-4 w-4 mr-1" />
                <span>UCS Translation</span>
              </TabsTrigger>
              <TabsTrigger value="types">
                <TypeIcon className="h-4 w-4 mr-1" />
                <span>Type Inference</span>
              </TabsTrigger>
              <TabsTrigger value="results">
                <VariableIcon className="h-4 w-4 mr-1" />
                <span>Code Generation</span>
              </TabsTrigger>
              <TabsTrigger value="execution">
                <VariableIcon className="h-4 w-4 mr-1" />
                <span>Execution</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </header>
        <TabsContent className="mt-0 pt-1.5 pb-3 px-3 flex-grow min-h-0" value="translation">
          <TranslationContent sourceCode={source} compilation={compilation} />
        </TabsContent>
        <TabsContent className="mt-0 pt-1.5 pb-3 px-3 flex-grow min-h-0" value="types">
          <TypeInferenceContent types={compilation?.types ?? null} />
        </TabsContent>
        <TabsContent className="mt-0 pt-1.5 pb-3 px-3 flex-grow min-h-0" value="results">
          <CodeGenerationContent />
        </TabsContent>
        <TabsContent className="mt-0 pt-1.5 pb-3 px-3 flex-grow min-h-0" value="execution">
          <EvaluationResult />
        </TabsContent>
      </div>
    </Tabs>
  );
}
