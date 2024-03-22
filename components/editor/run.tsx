import { PlayIcon } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";

export type RunButtonProps = ButtonProps &
  React.RefAttributes<HTMLButtonElement>;

export function RunButton(props: RunButtonProps) {
  return (
    <Button {...props}>
      <PlayIcon className="w-4 h-4 mr-1" />
      <span>Compile & Run</span>
    </Button>
  );
}
