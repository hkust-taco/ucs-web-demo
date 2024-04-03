import { nanoid } from "nanoid";
import { EvaluatedVariable } from "./VariableTable";

export type Task = {
  id: string;
  startedAt: Date;
  evaluatedAt: Date | null;
  code: string;
  variables: EvaluatedVariable[];
  error?: string;
};

export function freshTask(code: string): Task {
  return {
    id: nanoid(),
    startedAt: new Date(),
    evaluatedAt: null,
    code,
    variables: [],
  };
}
