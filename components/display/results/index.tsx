import { OctagonXIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StackTraceDisplay } from "../StackTraceDisplay";
import { ReportsSection } from "../inference/ReportsSection";
import { VariableTable } from "./VariableTable";
import type { TaskResult } from "./run.worker";
import { useTasks } from "./useTasks";
import EmptyContent from "../EmptyContent";

export type EvaluationResultProps = {};

export function EvaluationResult({}: EvaluationResultProps) {
  const workerRef = useRef<Worker | null>(null);
  const { tasks, finishTask, latestTask } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const onSelectTask = useCallback(
    (value: string) => {
      setSelectedTaskId(value === latestTask?.id ? null : value);
    },
    [latestTask]
  );

  // Install a worker to run the code.
  useEffect(() => {
    if (workerRef.current !== null) return;
    const worker = new Worker(new URL("./run.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (event: MessageEvent<TaskResult>) => {
      console.log("Received a message from the worker.", event.data);
      finishTask(event.data);
    };
    workerRef.current = worker;
    console.log("Worker installed.", worker);
  }, [finishTask]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? latestTask,
    [tasks, selectedTaskId, latestTask]
  );

  useEffect(() => {
    if (
      latestTask === null ||
      latestTask.type !== "success" ||
      latestTask.evaluatedAt !== null ||
      workerRef.current === null
    ) {
      return;
    }
    console.log("Sending a message to the worker.", latestTask.id);
    workerRef.current.postMessage({
      id: latestTask.id,
      code: latestTask.code,
    });
    console.log("Set the selected task to the latest task.");
    setSelectedTaskId(latestTask.id);
  }, [latestTask]);

  return (
    <div className="w-full h-full grid gap-4">
      {selectedTask === null || selectedTask === undefined ? (
        <EmptyContent>
          Please click the &ldquo;Compile & Run&rdquo; button on the left. The
          MLscript program on the left will be transpiled to a JavaScript
          function, which will be evaluated and displayed here. Any errors or
          warnings will be shown together.
        </EmptyContent>
      ) : selectedTask.type === "success" ? (
        <section className="flex flex-col gap-1.5 w-full overflow-hidden">
          {/* <SectionCaption>Code Execution Result</SectionCaption> */}
          <p className="text-sm text-muted-foreground mb-1.5">
            Compiling and running the program on the left side yields the
            following global variables and functions.
          </p>
          <main className="min-h-0 flex-1 w-full">
            {selectedTask?.error ? (
              <div className="flex flex-col border border-rose-900 rounded-md overflow-hidden">
                <header className="px-2 py-1 bg-rose-900 text-primary flex flex-row items-center">
                  <OctagonXIcon className="w-4 h-4 mr-1" />
                  <span className="font-semibold uppercase">Error</span>
                </header>
                <div className="p-2 text-primary">
                  <p>{selectedTask.error.message}</p>
                  {selectedTask.error.stack ? (
                    <StackTraceDisplay
                      stack={selectedTask.error.stack.split("\n")}
                    />
                  ) : null}
                </div>
              </div>
            ) : (
              <VariableTable variables={selectedTask?.variables ?? []} />
            )}
          </main>
        </section>
      ) : (
        <>
          <ReportsSection
            description={
              <>
                If there are issues with code generation, relevant errors and
                warnings would be listed here.
              </>
            }
            reports={selectedTask.reports}
          />
        </>
      )}
    </div>
  );
}
