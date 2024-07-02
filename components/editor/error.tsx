import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ErrorBoundaryProps } from "react-error-boundary";

export type EditorErrorDisplayProps = Parameters<
  NonNullable<ErrorBoundaryProps["fallbackRender"]>
>[0];

export function EditorErrorDisplay({
  error,
  resetErrorBoundary: reset,
}: EditorErrorDisplayProps) {
  const [crashedAt, setCrashedAt] = useState<Date | null>(null);
  useEffect(() => {
    setCrashedAt(new Date());
  }, []);
  const stack = useMemo(() => {
    return error instanceof Error
      ? error.stack
          ?.split("\n")
          .filter((line) => line.includes(" at"))
          .slice(0, 10)
          .map((line) => {
            const result = line.match(/^\s*at\s+([\w\.]+)\s+(\(.+\))s*$/);
            if (result === null) {
              return line;
            } else {
              return { name: result[1], location: result[2] };
            }
          })
      : null;
  }, [error]);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <h2 className="text-lg font-bold text-primary">
        The editor has crashed.
      </h2>
      <div className="max-w-[50%] text-muted-foreground">
        <h3 className="font-semibold">Error message: </h3>
        {error.message}
      </div>
      <div className="max-w-[50%]">
        <h3 className="font-semibold mb-1">Error stack: </h3>
        <ul className="flex flex-col gap-0.5">
          {stack?.map((line, index) => (
            <li className="truncate" key={index}>
              {typeof line === "string" ? (
                line
              ) : (
                <>
                  <code className="leading-4 text-sm font-mono font-medium">
                    {line.name}
                  </code>{" "}
                  <span className="leading-4 text-muted-foreground">
                    {line.location}
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {crashedAt === null ? null : (
        <div className="text-muted-foreground text-sm">
          Crashed at {crashedAt?.toLocaleTimeString()}
        </div>
      )}
      <Button onClick={reset} variant="outline">
        Click to Reset
      </Button>
    </div>
  );
}
