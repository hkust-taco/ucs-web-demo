import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2Icon } from "lucide-react";
import { useCallback, useState } from "react";
import { SettingsForm } from "./form";

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-primary" variant="outline">
          <Settings2Icon className="w-4 h-4 mr-1" />
          <span>Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="space-y-0 gap-2">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <SettingsForm onCancel={close} didSubmit={close} />
      </DialogContent>
    </Dialog>
  );
}
