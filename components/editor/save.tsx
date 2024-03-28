import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type ExampleSaveDialogProps = { onSubmit: (data: SaveFormData) => void };

const SaveFormSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  description: z.string(),
});

export type SaveFormData = z.output<typeof SaveFormSchema>;

export function ExampleSaveDialog({ onSubmit }: ExampleSaveDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SaveFormData>({
    resolver: zodResolver(SaveFormSchema),
  });
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SaveIcon className="w-4 h-4 mr-1" />
          <span>Save</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Example</DialogTitle>
          <DialogDescription>
            Enter the example name and click Save.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            setOpen(false);
          })}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              {...register("name")}
              placeholder="Example name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              {...register("description")}
              placeholder="Example description"
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!isValid}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
