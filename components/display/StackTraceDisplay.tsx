import { HTMLAttributes, forwardRef } from "react";

export const StackTraceDisplay = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { stack: string[] }
>(function StackTraceDisplay(props, ref) {
  return (
    <div ref={ref} {...props}>
      <div>
        <strong>Stack:</strong>
      </div>
      <ul className="pl-6 list-disc text-sm">
        {props.stack.slice(0, 10).map((frame, index) => (
          <li key={index}>
            <span className="text-muted-foreground">{frame}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});
