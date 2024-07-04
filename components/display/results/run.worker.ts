import type { JavaScriptType } from "./types";
import inspect from "object-inspect";

export type TaskInput = {
  id: string;
  code: string;
};

export type TaskResult = {
  id: string;
  variables: [string, JavaScriptType, string][];
  error?: TaskResultError;
};

export type TaskResultError = {
  message: string;
  stack?: string;
};

function getEnrichedType(value: unknown): JavaScriptType {
  return typeof value === "object"
    ? value === null
      ? "null"
      : Array.isArray(value)
      ? "array"
      : "object"
    : typeof value;
}

self.onmessage = (event: MessageEvent<TaskInput>) => {
  console.info(`Received a task: ${event.data.id}`);
  try {
    const variables = eval(event.data.code) as [string, unknown][];
    self.postMessage({
      id: event.data.id,
      variables: variables.map(([name, value]) => [
        name,
        getEnrichedType(value),
        inspect(value, { customInspect: true }),
      ]),
    } as TaskResult);
  } catch (error) {
    self.postMessage({
      id: event.data.id,
      variables: [],
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : {
              message: String(error),
              stack: undefined,
            },
    } as TaskResult);
  }
};
