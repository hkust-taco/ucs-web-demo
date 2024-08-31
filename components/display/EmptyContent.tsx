import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { PropsWithChildren } from "react";

export type EmptyContentProps = PropsWithChildren<{
  className?: string;
}>;

export default function EmptyContent({
  className,
  children,
}: EmptyContentProps) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-xl font-bold tracking-tight text-secondary-foreground">
          No results.
        </h3>
        <p className="text text-muted-foreground max-w-[75%]">{children}</p>
      </div>
    </div>
  );
}
