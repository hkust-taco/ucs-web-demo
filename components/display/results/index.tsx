import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useRef, useState } from "react";
import { GeneratedCode } from "./GeneratedCode";
import { VariableTable } from "./VariableTable";
import type { TaskResult } from "./run.worker";
import { useTasks } from "./useTasks";
import { TaskSelect } from "./TaskSelect";
import { ListVideoIcon, OctagonXIcon } from "lucide-react";
import { SectionCaption } from "../SectionCaption";

export type EvaluationResultProps = {};

export function EvaluationResult({}: EvaluationResultProps) {
  const workerRef = useRef<Worker | null>(null);
  const { tasks, finishTask, latestTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const onSelectTask = useCallback(
    (value: string) => {
      setSelectedTask(value === latestTask?.id ? null : value);
    },
    [latestTask]
  );

  // Install a worker to run the code.
  useEffect(() => {
    if (workerRef.current !== null) return;
    console.log(new URL("./run.worker.ts", import.meta.url));
    const worker = new Worker(new URL("./run.worker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent<TaskResult>) => {
      console.log("Received a message from the worker.", event.data);
      finishTask(event.data);
    };
    workerRef.current = worker;
    console.log("Worker installed.", worker);
  }, [finishTask]);

  useEffect(() => {
    if (
      latestTask === null ||
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
  }, [latestTask]);

  return (
    <div
      className="w-full h-full grid gap-4"
      style={{
        gridTemplateRows: "auto minmax(0, 1fr) minmax(0, 1fr)",
        gridTemplateColumns: "1fr",
      }}
    >
      <header className="flex flex-row gap-2 items-center">
        <Label
          className="flex-shrink-0 flex flex-row items-center"
          htmlFor="run"
        >
          <ListVideoIcon className="w-4 h-4 mr-1" />
          <span>Select Runs</span>
        </Label>
        <TaskSelect
          selectedTask={selectedTask ?? latestTask?.id}
          onSelectTask={onSelectTask}
        />
      </header>

      <section className="flex flex-col gap-1.5 w-full overflow-hidden">
        <SectionCaption>Generated JavaScript Code</SectionCaption>
        <main className="min-h-0 flex-1 w-full">
          <GeneratedCode code={latestTask?.code} />
        </main>
      </section>

      <section className="flex flex-col gap-1.5 w-full overflow-hidden">
        <SectionCaption>Code Execution Result</SectionCaption>
        <main className="min-h-0 flex-1 w-full">
          {latestTask?.error ? (
            <div className="flex flex-col border border-rose-900 rounded-md overflow-hidden">
              <header className="px-2  py-1 bg-rose-900 text-primary flex flex-row items-center">
                <OctagonXIcon className="w-4 h-4 mr-1" />
                <span className="font-semibold uppercase">Error</span>
              </header>
              <div className="p-2 text-primary">{latestTask.error}</div>
            </div>
          ) : (
            <VariableTable variables={latestTask?.variables ?? []} />
          )}
        </main>
      </section>
    </div>
  );
}
