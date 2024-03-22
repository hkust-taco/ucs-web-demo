import { useCallback, useState } from "react";
import type { TaskResult } from "./run.worker";
import { type Task, freshTask } from "./task";
import type { EvaluatedVariable } from "./VariableTable";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import inspect from "object-inspect";

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
    (code: string) => setTasks((prev) => [...prev, freshTask(code)]),
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
      setTasks((prev) => [...prev, freshTask(code)]);
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
            ? { ...task, evaluatedAt: new Date(), variables }
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
