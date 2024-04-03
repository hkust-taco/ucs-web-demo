export function SectionCaption({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold text-muted-foreground uppercase select-none">
      {children}
    </h3>
  );
}
