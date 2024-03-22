export type TypeOfValue =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "bigint"
  | "function"
  | "symbol"
  | "undefined";

export type JavaScriptType = TypeOfValue | "array" | "null";
