import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Report } from "@mlscript/ucs-demo-build";
import { ThumbsUpIcon } from "lucide-react";
import { SectionCaption } from "../SectionCaption";
import { ReportDisplay } from "./ReportDisplay";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type ReportsSection = {
  reports: Report[];
  className?: string;
  description?: ReactNode;
};

export function ReportsSection({
  className,
  description,
  reports,
}: ReportsSection) {
  return (
    <section
      className={cn("flex flex-col gap-1.5 w-full overflow-hidden", className)}
    >
      <SectionCaption>Errors and Warnings</SectionCaption>
      {description ? (
        <p className="text-sm text-muted-foreground mb-1.5">{description}</p>
      ) : null}
      <main className="min-h-0 flex-1 w-full">
        {reports.length === 0 ? (
          <div className="relative w-full h-full border border-border rounded-lg rounded-r-sm bg-muted">
            <Alert className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-72">
              <ThumbsUpIcon className="w-4 h-4" />
              <AlertTitle>No errors and warnings</AlertTitle>
              <AlertDescription>Everything looks good!</AlertDescription>
            </Alert>
          </div>
        ) : (
          <ScrollArea className="w-full h-full border border-border rounded-lg rounded-r-sm bg-muted">
            <div className="p-4 flex flex-col gap-4">
              {reports.map((report, index) => (
                <ReportDisplay key={index} report={report} />
              ))}
            </div>
          </ScrollArea>
        )}
      </main>
    </section>
  );
}
