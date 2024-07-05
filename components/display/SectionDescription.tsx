import { cn } from "@/lib/utils/cn";
import { forwardRef, type HTMLAttributes } from "react";

export const SectionDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function SectionDescription(
  props: HTMLAttributes<HTMLParagraphElement>,
  ref
) {
  return (
    <p
      ref={ref}
      {...props}
      className={cn(
        props.className,
        "flex-shrink-0 text-sm text-muted-foreground mb-1.5"
      )}
    >
      {props.children}
    </p>
  );
});
