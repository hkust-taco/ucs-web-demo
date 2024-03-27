import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { useCallback, useEffect, useRef } from "react";
// import { mlscript } from "@/lib/mlscript";
import {
  getCurrentTheme,
  useThemeAutoSwitch,
} from "@/lib/codemirror/useThemeAutoSwitch";
import { Example } from "@/lib/examples";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { Separator } from "../ui/separator";
import { ConfirmDialog, useConfirmDialog } from "./ConfirmDialog";
import { ExampleLoadForm } from "./examples";
import { RunButton } from "./run";
import { ExampleSaveDialog } from "./save";

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
        keymap.of([indentWithTab]),
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
  // Confirmation when loading examples
  const { showDialog, dialogProps } = useConfirmDialog();
  const onLoadExample = useCallback(
    (example: Example) => {
      console.log("here", example);
      showDialog(() => {
        console.log("here");
        editorRef.current?.dispatch({
          changes: {
            from: 0,
            to: editorRef.current.state.doc.length,
            insert: example.source,
          },
        });
      });
    },
    [showDialog]
  );
  return (
    <div className="p-4 w-full h-full flex flex-col gap-4">
      <header className="w-full flex-shrink-0 flex flex-row gap-3 items-center">
        <ExampleLoadForm className="flex-grow" onLoad={onLoadExample} />
        <ExampleSaveDialog />
        <Separator orientation="vertical" />
        <RunButton onClick={onRunClick} />
      </header>
      <main className="w-full min-h-0 flex-grow" ref={containerRef}></main>
      <ConfirmDialog {...dialogProps} />
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
