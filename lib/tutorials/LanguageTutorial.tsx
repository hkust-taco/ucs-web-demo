import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, ArrowRightIcon, BookOpenTextIcon } from "lucide-react";
import Section1 from "./section-1.mdx";
import { useState } from "react";

export type LanguageTutorialProps = ButtonProps &
  React.RefAttributes<HTMLButtonElement>;

export function LanguageTutorial(props: LanguageTutorialProps) {
  // eslint-disable-next-line react/jsx-key
  const pages = [<Section1 />];
  const [page, setPage] = useState(0);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>
          <BookOpenTextIcon className="w-4 h-4 mr-1" />
          <span>MLscript Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl min-h-[50vh] max-h-[90vh] grid-rows-[auto,minmax(0,1fr),auto]">
        <DialogHeader className="space-y-0 gap-2">
          <DialogTitle>MLscript Guide</DialogTitle>
        </DialogHeader>
        <Separator />
        <ScrollArea className="prose dark:prose-invert">
          {pages[page]}
        </ScrollArea>
        <DialogFooter className="flex flex-row sm:justify-between items-center">
          <Button
            type="button"
            variant="secondary"
            disabled={page <= 0}
            onClick={() => setPage(Math.max(0, page - 1))}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1 -ml-1" />
            <span>Previous</span>
          </Button>
          <div className="text-muted-foreground uppercase text-sm font-medium">
            Page {page + 1} / {pages.length}
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={page >= pages.length - 1}
            onClick={() => setPage(Math.min(pages.length - 1, page + 1))}
          >
            <span>Next</span>
            <ArrowRightIcon className="w-4 h-4 ml-1 -mr-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
