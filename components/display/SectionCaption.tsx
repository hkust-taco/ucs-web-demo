export function SectionCaption({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text font-bold uppercase select-none">
      {children}
    </h3>
  );
}
