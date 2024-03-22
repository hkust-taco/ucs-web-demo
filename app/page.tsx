"use client";

import { DisplayPanelContent } from "@/components/display";
import { EditorPanelContent } from "@/components/editor";
import { EditorErrorDisplay } from "@/components/editor/error";
import { SettingsButton } from "@/components/header/settings";
import { TutorialButton } from "@/components/header/tutorial";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useCallback, useState } from "react";
import { Compilation, WebDemo } from "@mlscript/ucs-demo-build";
import { useAppendTask } from "@/components/display/results/useTasks";
// import dynamic from "next/dynamic";

// const EditorPanelContent = dynamic(
//   import("@/components/editor").then((module) => module.EditorPanelContent),
//   { ssr: false, loading: () => <div>Loading...</div> }
// );

export default function Home() {
  const [compilation, setCompilation] = useState<Compilation | null>(null);
  const appendTask = useAppendTask();
  const onRun = useCallback(
    (source: string) => {
      const compilation = WebDemo.compile(source);
      setCompilation(compilation);
      if (typeof compilation.target?.content === "string") {
        appendTask(compilation.target?.content);
      }
    },
    [appendTask]
  );
  return (
    <div className="w-full h-full flex flex-col">
      <header className="top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 flex h-14 items-center">
          <h1 className="text-lg font-medium">
            <span>Ultimate Conditional Syntax</span>{" "}
            <span className="text-muted-foreground">Web Demo</span>
          </h1>
          <nav className="ml-auto flex flex-row gap-3">
            <SettingsButton />
            <TutorialButton />
          </nav>
        </div>
      </header>
      <ResizablePanelGroup className="flex-grow" direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={25}>
          <ErrorBoundary errorComponent={EditorErrorDisplay}>
            <EditorPanelContent onRun={onRun} />
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          <DisplayPanelContent compilation={compilation} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
