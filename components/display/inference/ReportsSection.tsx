import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Report } from "@mlscript/ucs-demo-build";
import { ThumbsUpIcon } from "lucide-react";
import { SectionCaption } from "../SectionCaption";
import { ReportDisplay } from "./ReportDisplay";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import EmptyContent from "../EmptyContent";

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
      <SectionCaption>Diagnostics</SectionCaption>
      {description ? (
        <p className="text-sm text-muted-foreground mb-1.5">{description}</p>
      ) : null}
      <main className="min-h-0 flex-1 w-full">
        {reports.length === 0 ? (
          <EmptyContent>No diagnostic information.</EmptyContent>
        ) : (
          <ScrollArea className="w-full h-full border border-dashed border-border rounded-lg rounded-r-sm">
            <div className="p-2.5 flex flex-col gap-2">
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
