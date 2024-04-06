import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeftIcon, ArrowRightIcon, CircleHelpIcon } from "lucide-react";
import ReadMe from "./readme.mdx";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TutorialButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-primary" variant="outline">
          <CircleHelpIcon className="w-4 h-4 mr-1" />
          <span>Tutorials</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl min-h-[50vh] max-h-[90vh] grid-rows-[auto,minmax(0,1fr),auto]">
        <DialogHeader className="space-y-0 gap-2">
          <DialogTitle>Tutorials</DialogTitle>
          {/* <DialogDescription>
            We should put some tutorials in this dialog.
          </DialogDescription> */}
        </DialogHeader>
        <ScrollArea className="prose dark:prose-invert">
          <ReadMe />
        </ScrollArea>
        <DialogFooter className="sm:justify-start">
          {/* <Button type="button" variant="secondary">
            <ArrowLeftIcon className="w-4 h-4 mr-1 -ml-1" />
            <span>Previous</span>
          </Button>
          <Button type="button" variant="secondary">
            <span>Next</span>
            <ArrowRightIcon className="w-4 h-4 ml-1 -mr-1" />
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
