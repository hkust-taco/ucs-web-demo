import { basicSetup, EditorView } from "codemirror";
import {
  getCurrentTheme,
  useThemeAutoSwitch,
} from "../codemirror/useThemeAutoSwitch";
import { useEffect, useRef } from "react";
import { mlscript } from "../mlscript";
import { EditorState } from "@codemirror/state";

export type CodeBlockProps = { source: string };

export default function CodeBlock({ source }: CodeBlockProps) {
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current === null) return;
    if (editorRef.current !== null) return;
    const initialState = EditorState.create({
      doc: source,
      extensions: [
        basicSetup,
        mlscript(),
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
    if (editorRef.current === null) return;
    editorRef.current.dispatch({
      changes: {
        from: 0,
        to: editorRef.current.state.doc.length,
        insert: source,
      },
    });
  }, [source]);
  useThemeAutoSwitch(editorRef);
  return <div className="w-full" ref={containerRef} />;
}
