import {
  getCurrentTheme,
  useThemeAutoSwitch,
} from "@/lib/codemirror/useThemeAutoSwitch";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useEffect, useRef } from "react";

export type GeneratedCodeProps = {
  code?: string | null;
};

export function GeneratedCode({ code }: GeneratedCodeProps) {
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const doc = code ?? DEFAULT_CODE;
  useEffect(() => {
    if (containerRef.current === null) return;
    if (editorRef.current !== null) return;
    const initialState = EditorState.create({
      doc,
      extensions: [basicSetup, javascript(), getCurrentTheme()],
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
  return <div className="w-full h-full" ref={containerRef}></div>;
}

const DEFAULT_CODE =
  "// Enter the code in the editor on the left and hit the Run button to compile.";
