import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

export type StageSectionProps = {
  caption: ReactNode;
  children: ReactNode;
  noOutline?: boolean;
};

export function StageSection({
  caption,
  children,
  noOutline = false,
}: StageSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-bold mb-1 text-muted-foreground uppercase">
        {caption}
      </h3>
      <div
        className={cn(
          "w-full mr-2",
          noOutline ? "" : "border-border border rounded-md px-4 py-3 "
        )}
      >
        {children}
      </div>
    </section>
  );
}
