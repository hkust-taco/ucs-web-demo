import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormSection, FormSectionCaption, FormSectionContent } from "./section";
import { DialogFooter } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  theme: z
    .union([z.literal("light"), z.literal("dark"), z.literal("system")])
    .default("system")
    .optional(),
  showParsedAST: z.boolean().default(false).optional(),
  showEditorDebug: z.boolean().default(false).optional(),
});

export type SettingsFormData = z.output<typeof FormSchema>;

export type SettingsFormProps = {
  didSubmit?: (data: SettingsFormData) => void;
  onCancel?: () => void;
};

export function SettingsForm({ didSubmit, onCancel }: SettingsFormProps) {
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { theme: "system" },
  });

  const onSubmit = useCallback(
    (data: SettingsFormData) => {
      console.info("onSubmit", data);
      didSubmit?.(data);
    },
    [didSubmit]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormSection>
          <FormSectionCaption>User Interface</FormSectionCaption>
          <FormSectionContent>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Theme</FormLabel>
                    <FormDescription>
                      Set the theme of the entire user interface.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="inline-flex flex-row items-center">
                            <SunIcon className="w-4 h-4 mr-1" />
                            <span className="text-sm">Light</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="inline-flex flex-row items-center">
                            <MoonIcon className="w-4 h-4 mr-1" />
                            <span className="text-sm">Dark</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="inline-flex flex-row items-center">
                            <MonitorIcon className="w-4 h-4 mr-1" />
                            <span className="text-sm">System</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </FormSectionContent>
        </FormSection>
        <FormSection>
          <FormSectionCaption>Debugging</FormSectionCaption>
          <FormSectionContent>
            <FormField
              control={form.control}
              name="showEditorDebug"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Show editor debug information</FormLabel>
                    <FormDescription>
                      Show some additional debug information (tokenization and
                      parsed AST) of the editor in the the right-hand side
                      panel.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </FormSectionContent>
        </FormSection>
        <DialogFooter>
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            disabled={!form.formState.isDirty}
          >
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
