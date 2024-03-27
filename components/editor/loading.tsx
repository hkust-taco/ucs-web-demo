import { LoaderCircleIcon } from "lucide-react";

export function EditorLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-2xl flex flex-row items-center text-muted-foreground">
        <LoaderCircleIcon className="animate-spin w-6 h-6 mr-2" />
        <span className="font-semibold">Editor is loading...</span>
      </div>
    </div>
  );
}
