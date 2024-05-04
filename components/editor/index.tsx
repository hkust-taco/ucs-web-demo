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
// import { Separator } from "../ui/separator";
import { ConfirmDialog, useConfirmDialog } from "./ConfirmDialog";
import { ExampleLoadForm } from "./examples";
import { RunButton } from "./run";
// import { ExampleSaveDialog } from "./save";
import { useAppendExample } from "@/lib/examples/hooks";

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
      if (editorRef.current === null) return;
      // const isClean = editorGenerationRef.current === null || editorRef.current.state.;
      // showDialog(() => {
      //   editorRef.current?.dispatch({
      //     changes: {
      //       from: 0,
      //       to: editorRef.current.state.doc.length,
      //       insert: example.source,
      //     },
      //   });
      // });
      editorRef.current?.dispatch({
        changes: {
          from: 0,
          to: editorRef.current.state.doc.length,
          insert: example.source,
        },
      });
      onRun?.(example.source);
    },
    [showDialog, onRun]
  );
  // const appendExample = useAppendExample();
  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full flex-shrink-0 p-4 flex flex-row gap-3 justify-between items-center border-b border-b-border">
        <div className="font-bold text-lg">Code Editor</div>
        <RunButton onClick={onRunClick} />
      </header>
      <div className="p-4 w-full min-h-0 flex-grow flex flex-col gap-4">
        <header className="w-full flex-shrink-0 flex flex-row gap-3 items-center">
          <ExampleLoadForm className="flex-grow" onLoad={onLoadExample} />
          {/* <ExampleSaveDialog
          onSubmit={(data) => {
            appendExample({
              group: "user",
              name: data.name,
              source: editorRef.current?.state.doc.toString() ?? "",
              builtin: false,
            });
          }}
        /> */}
          {/* <Separator orientation="vertical" /> */}
        </header>
        <main className="w-full min-h-0 flex-grow" ref={containerRef}></main>
        <ConfirmDialog {...dialogProps} />
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
