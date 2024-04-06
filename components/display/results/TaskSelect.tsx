import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTasksValue } from "./useTasks";
import { ReactNode, useMemo } from "react";
import type { Task } from "./task";

export type TaskSelectProps = {
  selectedTask?: string | null;
  onSelectTask?: (value: string) => void;
};

export function TaskSelect({ selectedTask, onSelectTask }: TaskSelectProps) {
  const tasks = useTasksValue();
  const latestTask = useMemo(() => {
    if (tasks.length === 0) return null;
    let latestTask = tasks[0];
    for (const task of tasks) {
      if (task.createdAt > latestTask.createdAt) {
        latestTask = task;
      }
    }
    return latestTask;
  }, [tasks]);
  const tasksWithName = useMemo(
    () =>
      tasks.map(
        (task) =>
          [
            task,
            <>
              Compiled at <EmphasizedTime time={task.createdAt} />,
              {task.type === "success" ? (
                task.evaluatedAt === null ? (
                  " never evaluated"
                ) : (
                  <>
                    {" "}
                    evaluated at <EmphasizedTime time={task.evaluatedAt} />
                  </>
                )
              ) : (
                <> code generation failed</>
              )}
              .
            </>,
          ] satisfies [Task, ReactNode]
      ),
    [tasks]
  );
  return (
    <Select value={selectedTask ?? undefined} onValueChange={onSelectTask}>
      <SelectTrigger className="flex-grow">
        <SelectValue
          id="run"
          className="select-none"
          placeholder="Please select a run to display the variable's results in the table below."
        />
      </SelectTrigger>
      <SelectContent>
        {tasksWithName.map(([task, name]) => (
          <SelectItem key={task.id} value={task.id} className="select-none">
            {task === latestTask ? (
              <span>
                <strong>Latest</strong> —{" "}
              </span>
            ) : null}
            <span>{name}</span>
          </SelectItem>
        ))}
        {tasksWithName.length === 0 ? (
          <SelectItem value="null" disabled>
            No tasks to show.
          </SelectItem>
        ) : null}
      </SelectContent>
    </Select>
  );
}

function EmphasizedTime({ time }: { time: Date }) {
  return (
    <time className="px-px underline underline-offset-2 tabular-nums">
      {time.toLocaleTimeString()}
    </time>
  );
}
