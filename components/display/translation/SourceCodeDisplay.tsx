import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getCurrentTheme,
  useThemeAutoSwitch,
} from "@/lib/codemirror/useThemeAutoSwitch";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { ReactNode, useEffect, useRef } from "react";
import { StageSection } from "./StageSection";
import { mlscript } from "@/lib/mlscript";

export type SourceCodeDisplayProps = {
  caption: ReactNode;
  lines: string[];
};

export function SourceCodeDisplay({ caption, lines }: SourceCodeDisplayProps) {
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current === null) return;
    if (editorRef.current !== null) return;
    const initialState = EditorState.create({
      doc: "",
      extensions: [
        basicSetup,
        getCurrentTheme(),
        EditorState.readOnly.of(true),
        mlscript(),
      ],
    });
    const editor = new EditorView({
      state: initialState,
      parent: containerRef.current,
    });
    editorRef.current = editor;
  });
  useThemeAutoSwitch(editorRef);
  useEffect(() => {
    if (editorRef.current === null) return;
    editorRef.current.dispatch({
      changes: {
        from: 0,
        to: editorRef.current.state.doc.length,
        insert: lines.join("\n"),
      },
    });
  }, [lines]);
  return (
    <StageSection caption={caption} noOutline>
      <main className="w-full min-h-0 flex-grow" ref={containerRef}></main>
    </StageSection>
  );
}
