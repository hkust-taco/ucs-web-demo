import { DiagnosticReportMessage, Report } from "@mlscript/ucs-demo-build";
import { OctagonAlertIcon, OctagonXIcon, SkullIcon } from "lucide-react";
import { Fragment, useMemo } from "react";
import { StackTraceDisplay } from "../StackTraceDisplay";

export type ReportDisplayProps = { report: Report };

export function ReportDisplay({ report }: ReportDisplayProps) {
  // const messages = useMemo(() => {

  // }, [report.])
  return (
    <div className="flex flex-col border border-rose-700 dark:border-rose-900 rounded-md overflow-hidden shadow bg-background">
      <header className="px-2 py-1 bg-rose-700 dark:bg-rose-900 text-secondary dark:text-primary flex flex-row items-center">
        {report.kind === "fatal" ? (
          <SkullIcon className="w-4 h-4 mr-1" />
        ) : report.kind === "error" ? (
          <OctagonXIcon className="w-4 h-4 mr-1" />
        ) : (
          <OctagonAlertIcon className="w-4 h-4 mr-1" />
        )}
        <span className="font-semibold uppercase">
          {report.kind === "fatal" ? "fatal error" : report.kind}
        </span>
      </header>
      <div className="p-3 pb-4 text-primary flex flex-col gap-1">
        {report.kind === "fatal" ? (
          <>
            <p>
              <strong>Message:</strong> {report.message}
            </p>
            <StackTraceDisplay stack={report.stack} />
          </>
        ) : (
          <MessageListDisplay messages={report.messages} />
        )}
      </div>
    </div>
  );
}

type MessageListDisplayProps = { messages: DiagnosticReportMessage[] };

function MessageListDisplay({ messages }: MessageListDisplayProps) {
  const chunks = useMemo(() => makeChunks(messages), [messages]);
  return (
    <>
      {chunks.map((chunk, index) => (
        <Fragment key={index}>
          {typeof chunk === "string" ? (
            <div key={index}>
              <span>{chunk}</span>
            </div>
          ) : (
            chunk.map((line) => <CodeBlockLine key={line.line} {...line} />)
          )}
        </Fragment>
      ))}
    </>
  );
}

type CodeBlockLineProps = {
  content: string;
  line: number;
  range: [number, number];
};

function CodeBlockLine({
  line,
  content,
  range: [start, end],
}: CodeBlockLineProps) {
  return (
    <div className="py-0.5 flex flex-row items-center font-mono border border-border rounded-sm">
      <div className="text-muted-foreground border-r border-border pl-2 pr-1">
        {line}
      </div>
      <div className="pl-2">
        <span className="text-muted-foreground">{content.slice(0, start)}</span>
        <span className="-mx-0.5 px-0.5 rounded-sm bg-muted">
          {content.slice(start, end)}
        </span>
        <span className="text-muted-foreground">{content.slice(end)}</span>
      </div>
    </div>
  );
}

type MessageChunk = string | CodeBlockLineProps[]; // string[] is a code block

function makeChunks(messages: DiagnosticReportMessage[]) {
  const chunks: MessageChunk[] = [];
  for (const message of messages) {
    const last = chunks[chunks.length - 1];
    if (Array.isArray(last) && message.kind === "code") {
      last.push(message);
    } else {
      chunks.push(message.kind === "code" ? [message] : message.content);
    }
  }
  return chunks;
}
