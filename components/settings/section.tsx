import { ReactNode } from "react";

export function FormSection({ children }: { children: ReactNode }) {
  return <section className="space-y-4">{children}</section>;
}

export function FormSectionContent({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

export function FormSectionCaption({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 font-semibold leading-none tracking-tight">
      {children}
    </h3>
  );
}
