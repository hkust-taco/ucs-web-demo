import { Report } from "@mlscript/ucs-demo-build";
import { OctagonAlertIcon, OctagonXIcon, SkullIcon } from "lucide-react";

export type ReportDisplayProps = { report: Report };

export function ReportDisplay({ report }: ReportDisplayProps) {
  return (
    <div className="flex flex-col border border-rose-700 dark:border-rose-900 rounded-md overflow-hidden shadow bg-background">
      <header className="px-2  py-1 bg-rose-700 dark:bg-rose-900 text-secondary dark:text-primary flex flex-row items-center">
        {report.kind === "fatal" ? (
          <SkullIcon className="w-4 h-4 mr-1" />
        ) : report.kind === "error" ? (
          <OctagonXIcon className="w-4 h-4 mr-1" />
        ) : (
          <OctagonAlertIcon className="w-4 h-4 mr-1" />
        )}
        <span className="font-semibold uppercase">{report.kind}</span>
      </header>
      <div className="p-3 pb-4 text-primary flex flex-col gap-1">
        {report.kind === "fatal" ? (
          <>
            <p>
              <strong>Message:</strong> {report.message}
            </p>
            <div>
              <div>
                <strong>Stack:</strong>
              </div>
              <ul className="pl-6 list-disc text-sm">
                {report.stack.slice(0, 10).map((frame, index) => (
                  <li key={index}>
                    <span className="text-muted-foreground">{frame}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          report.messages.map((message, index) =>
            message.kind === "text" ? (
              <div key={index}>
                <span>{message.content}</span>
              </div>
            ) : (
              <div
                className="flex flex-row items-center font-mono border border-border rounded-sm"
                key={index}
              >
                <div className="text-muted-foreground border-r border-border pl-2 pr-1">
                  {message.line}
                </div>
                <div className="pl-2">{message.content}</div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
