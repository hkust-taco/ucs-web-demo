import {
  getCurrentTheme,
  useThemeAutoSwitch,
} from "@/lib/codemirror/useThemeAutoSwitch";
import { mlscript } from "@/lib/mlscript";
import { indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useCallback, useEffect, useRef } from "react";
// import { Separator } from "../ui/separator";
import { RunButton } from "./run";
// import { ExampleSaveDialog } from "./save";
import { useSelectedExample } from "@/lib/store/example";

export type EditorPanelContentProps = {
  onRun?: (source: string) => void;
};

export function EditorPanelContent({ onRun }: EditorPanelContentProps) {
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const editorGenerationRef = useRef<number | null>(null);
  useEffect(() => {
    if (containerRef.current === null) return;
    if (editorRef.current !== null) return;
    const initialState = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        mlscript(),
        getCurrentTheme(),
      ],
    });
    const editor = new EditorView({
      state: initialState,
      parent: containerRef.current,
    });
    editorRef.current = editor;
  });
  useThemeAutoSwitch(editorRef);
  const onRunClick = useCallback(() => {
    onRun?.(editorRef.current?.state.doc.toString() ?? "");
  }, [onRun]);
  // Confirmation when loading examples
  const selectedExample = useSelectedExample();
  useEffect(() => {
    if (selectedExample === null || editorRef.current === null) return;
    editorRef.current?.dispatch({
      changes: {
        from: 0,
        to: editorRef.current.state.doc.length,
        insert: selectedExample.source,
      },
    });
    // TODO: Clear the undo history
    onRun?.(selectedExample.source);
  }, [onRun, selectedExample]);
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-3 w-full min-h-0 flex-grow flex flex-col gap-3">
        <header className="w-full flex-shrink-0 flex flex-row gap-3 items-center">
          <RunButton variant="outline" onClick={onRunClick} />
        </header>
        <main className="w-full min-h-0 flex-grow" ref={containerRef}></main>
      </div>
    </div>
  );
}

const code = `abstract class Option[T]
class Some[T](value: T) extends Option[T]
module None extends Option[nothing]
class Pair[A, B](x: A, y: B)

let some = (x) => Some(x)
let none = None

fun getOrElse(x, default) = if x is
  Some(value) then value
  None then default
`;
