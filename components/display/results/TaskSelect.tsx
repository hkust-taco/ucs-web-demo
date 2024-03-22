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
  const tasksWithName = useMemo(
    () =>
      tasks.map(
        (task) =>
          [
            task,
            <>
              Compiled at <EmphasizedTime time={task.startedAt} />,{" "}
              {task.evaluatedAt === null ? (
                "never evaluated"
              ) : (
                <>
                  evaluated at <EmphasizedTime time={task.evaluatedAt} />
                </>
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
          <SelectItem key={task.id} value={task.id}>
            {name}
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
