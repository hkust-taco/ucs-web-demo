import { useCallback } from "react";
import type { TaskResult } from "./run.worker";
import { type Task, freshSuccessTask } from "./task";
import type { EvaluatedVariable } from "./VariableTable";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

type UseTasksResult = {
  readonly tasks: Task[];
  appendTask: (code: string) => void;
  finishTask: (result: TaskResult) => void;
  readonly latestTask: Task | null;
};

const atomTasks = atom<Task[]>([]);

export function useAppendTask() {
  const setTasks = useSetAtom(atomTasks);
  return useCallback(
    (task: Task) => setTasks((prev) => [...prev, task]),
    [setTasks]
  );
}

export function useTasksValue(): Task[] {
  return useAtomValue(atomTasks);
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useAtom(atomTasks);
  const appendTask = useCallback(
    (code: string) => {
      setTasks((prev) => [...prev, freshSuccessTask(code)]);
    },
    [setTasks]
  );
  const finishTask = useCallback(
    (result: TaskResult) => {
      console.log(result);
      const variables: EvaluatedVariable[] = result.variables.map(
        ([name, type, inspection]) => ({
          name,
          type,
          inspection,
        })
      );
      setTasks((prev) =>
        prev.map((task) =>
          task.id === result.id
            ? {
                ...task,
                evaluatedAt: new Date(),
                variables,
                error: result.error,
              }
            : task
        )
      );
    },
    [setTasks]
  );
  return {
    tasks,
    appendTask,
    finishTask,
    latestTask: tasks.at(-1) ?? null,
  };
}
