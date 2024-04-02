"use client";

import { DisplayPanelContent } from "@/components/display";
import { useAppendTask } from "@/components/display/results/useTasks";
// import { EditorPanelContent } from "@/components/editor";
import { EditorErrorDisplay } from "@/components/editor/error";
import { EditorLoading } from "@/components/editor/loading";
import { Header } from "@/components/header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Compilation, WebDemo } from "@mlscript/ucs-demo-build";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const EditorPanelContent = dynamic(
  () => import("@/components/editor").then((m) => m.EditorPanelContent),
  { ssr: false, loading: EditorLoading }
);

export default function Home() {
  const [lastSource, setLastSource] = useState<string | null>(null);
  const [compilation, setCompilation] = useState<Compilation | null>(null);
  const appendTask = useAppendTask();
  const onRun = useCallback(
    (source: string) => {
      const compilation = WebDemo.compile(source);
      setCompilation(compilation);
      setLastSource(source);
      if (typeof compilation.target?.content === "string") {
        appendTask(compilation.target?.content);
      }
    },
    [appendTask]
  );
  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <ResizablePanelGroup className="flex-grow" direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={25}>
          <ErrorBoundary errorComponent={EditorErrorDisplay}>
            <EditorPanelContent onRun={onRun} />
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          <DisplayPanelContent source={lastSource} compilation={compilation} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
