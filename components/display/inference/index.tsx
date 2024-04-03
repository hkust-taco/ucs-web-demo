import {
  getCurrentTheme,
  useThemeAutoSwitch,
} from "@/lib/codemirror/useThemeAutoSwitch";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { StageResult } from "@mlscript/ucs-demo-build";
import { basicSetup } from "codemirror";
import { useEffect, useRef } from "react";
import { SectionCaption } from "../SectionCaption";
import { ReportDisplay } from "./ReportDisplay";
import { ThumbsUpIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

export type TypeInferenceContentProps = {
  types: StageResult<string> | null;
};

export function TypeInferenceContent({ types }: TypeInferenceContentProps) {
  console.log("Type Inference", types);
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const doc = types?.content ?? DEFAULT_CODE;
  const reports = types?.reports ?? [];
  useEffect(() => {
    if (containerRef.current === null) return;
    if (editorRef.current !== null) return;
    const initialState = EditorState.create({
      doc,
      extensions: [
        basicSetup,
        getCurrentTheme(),
        EditorState.readOnly.of(true),
      ],
    });
    const editor = new EditorView({
      state: initialState,
      parent: containerRef.current,
    });
    editorRef.current = editor;
  });
  useEffect(() => {
    editorRef?.current?.dispatch({
      changes: {
        from: 0,
        to: editorRef?.current?.state.doc.length,
        insert: doc,
      },
    });
  }, [doc]);
  // Switch theme based on system preference.
  useThemeAutoSwitch(editorRef);
  return (
    <div
      className="w-full h-full grid gap-4"
      style={{
        gridTemplateRows: "minmax(0, 1fr) minmax(0, 1fr)",
        gridTemplateColumns: "1fr",
      }}
    >
      <section className="flex flex-col gap-1.5 w-full overflow-hidden">
        <SectionCaption>Inferred Types</SectionCaption>
        <main className="min-h-0 flex-1 w-full">
          <div className="w-full h-full" ref={containerRef}></div>
        </main>
      </section>
      <section className="flex flex-col gap-1.5 w-full overflow-hidden">
        <SectionCaption>Type Errors and Warnings</SectionCaption>
        <main className="min-h-0 flex-1 w-full">
          {reports.length === 0 ? (
            <Alert>
              <ThumbsUpIcon className="w-4 h-4" />
              <AlertTitle>No errors and warnings</AlertTitle>
              <AlertDescription>Everything looks good!</AlertDescription>
            </Alert>
          ) : (
            <ScrollArea className="w-full h-full border border-border rounded-lg rounded-r-sm">
              <div className="p-2 pr-3 flex flex-col gap-4">
                {reports.map((report, index) => (
                  <ReportDisplay key={index} report={report} />
                ))}
              </div>
            </ScrollArea>
          )}
        </main>
      </section>
    </div>
  );
}

const DEFAULT_CODE =
  "// Enter the code in the editor on the left and hit the Run button to compile.";
