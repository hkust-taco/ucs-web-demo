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
import { ReportsSection } from "./ReportsSection";

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
        <p className="flex-shrink-0 text-sm text-muted-foreground mb-1.5">
          The type inference and check results of the code on the left side will
          be displayed here.
        </p>
        <main className="min-h-0 flex-1 w-full">
          <div className="w-full h-full" ref={containerRef}></div>
        </main>
      </section>
      <ReportsSection
        description={
          <>
            If there are issues with type checking, relevant errors and warnings
            will be listed here.
          </>
        }
        reports={reports}
      />
    </div>
  );
}

const DEFAULT_CODE =
  "// Enter the code in the editor on the left and hit the Run button to compile.";
