import { DiagnosticReport } from "@mlscript/ucs-demo-build";
import { ReactNode } from "react";
import { ReportDisplay } from "../inference/ReportDisplay";
import { StageSection } from "./StageSection";

export type CoverageCheckingDisplayProps = {
  caption: ReactNode;
  diagnostics: DiagnosticReport[];
};

export function CoverageCheckingDisplay({
  caption,
  diagnostics,
}: CoverageCheckingDisplayProps) {
  return (
    <StageSection caption={caption}>
      {diagnostics.length === 0 ? (
        <div className="py-4 flex flex-col items-center gap-1 text-center">
          <h3 className="text-xl font-bold tracking-tight text-secondary-foreground">
            No errors
          </h3>
          <p className="text text-muted-foreground max-w-[75%]">
            Everything looks good!
          </p>
        </div>
      ) : (
        diagnostics.map((report, index) => (
          <ReportDisplay key={index} report={report} />
        ))
      )}
    </StageSection>
  );
}
