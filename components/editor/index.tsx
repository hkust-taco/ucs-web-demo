import { defaultKeymap } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView, gutter, keymap, lineNumbers } from "@codemirror/view";
import { useCallback, useEffect, useRef } from "react";
// import { mlscript } from "@/lib/mlscript";
import {
  getCurrentTheme,
  useThemeAutoSwitch,
} from "@/lib/codemirror/useThemeAutoSwitch";
import { ExampleLoadForm } from "./examples";
import { ExampleSaveDialog } from "./save";
import { basicSetup } from "codemirror";
import { RunButton } from "./run";

export type EditorPanelContentProps = {
  onRun?: (source: string) => void;
};

export function EditorPanelContent({ onRun }: EditorPanelContentProps) {
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current === null) return;
    if (editorRef.current !== null) return;
    const initialState = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        // mlscript(), // It's broken for now. :-(
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
  return (
    <div className="p-4 w-full h-full flex flex-col gap-4">
      <header className="w-full flex-shrink-0 flex flex-row gap-3 items-center">
        <ExampleLoadForm className="flex-grow" onLoad={() => {}} />
        <ExampleSaveDialog />
        <RunButton onClick={onRunClick} />
      </header>
      <main className="w-full min-h-0 flex-grow" ref={containerRef}></main>
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
