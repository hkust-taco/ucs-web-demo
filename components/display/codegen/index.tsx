import { useMemo, useState } from "react";
import { SectionCaption } from "../SectionCaption";
import { ReportsSection } from "../inference/ReportsSection";
import { GeneratedCode } from "./GeneratedCode";
import { useTasks } from "../results/useTasks";
import EmptyContent from "../EmptyContent";

export type CodeGenerationContentProps = {};

export function CodeGenerationContent({}: CodeGenerationContentProps) {
  const { tasks, latestTask } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? latestTask,
    [tasks, selectedTaskId, latestTask]
  );

  return (
    <div className="w-full h-full">
      {selectedTask === null ||
      selectedTask === undefined ||
      selectedTask.type === "success" ? (
        <section className="w-full h-full flex flex-col gap-1.5 overflow-hidden">
          {selectedTask === null || selectedTask === undefined ? (
            <EmptyContent>
              Please click the &ldquo;Compile & Run&rdquo; button on the left.
              Then, the MLscript program on the left will be transpiled to a
              JavaScript function and displayed here. Any errors or warnings
              will be shown together.
            </EmptyContent>
          ) : (
            <main className="min-h-0 flex-1 w-full">
              <GeneratedCode code={selectedTask?.code} />
            </main>
          )}
        </section>
      ) : (
        <ReportsSection
          description={
            <>
              If there are issues with code generation, relevant errors and
              warnings would be listed here.
            </>
          }
          reports={selectedTask.reports}
        />
      )}
    </div>
  );
}
