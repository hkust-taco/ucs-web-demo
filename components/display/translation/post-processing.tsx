import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PostProcessingContent() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold">Stage 3: Post-Processing</h3>
      </CardHeader>
      <CardContent>We should show parsing results here.</CardContent>
    </Card>
  );
}
