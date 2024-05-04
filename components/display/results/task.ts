import { nanoid } from "nanoid";
import { EvaluatedVariable } from "./VariableTable";
import { Report } from "@mlscript/ucs-demo-build";
import type { TaskResultError } from "./run.worker";

export type Task = {
  id: string;
  createdAt: Date;
} & (
  | { type: "failure"; reports: Report[] }
  | {
      type: "success";
      evaluatedAt: Date | null;
      code: string;
      variables: EvaluatedVariable[];
      error?: TaskResultError;
    }
);

export function freshFailureTask(reports: Report[]): Task {
  return {
    id: nanoid(),
    type: "failure",
    createdAt: new Date(),
    reports,
  };
}

export function freshSuccessTask(code: string): Task {
  return {
    id: nanoid(),
    type: "success",
    createdAt: new Date(),
    evaluatedAt: null,
    code,
    variables: [],
  };
}
