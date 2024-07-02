// import { SettingsButton } from "../settings";
import { ExampleLoadForm } from "../editor/examples";
import { Separator } from "../ui/separator";
import { Menu } from "./menu";

export function Header() {
  return (
    <header className="header">
      <div className="px-4 flex h-14 items-center">
        <h1 className="font-medium select-none flex-shrink-0 lg:text-lg lg:block text-sm flex flex-col">
          <span>Ultimate Conditional Syntax</span>{" "}
          <span className="text-muted-foreground">Web Demo</span>
        </h1>
        <Menu className="ml-auto" />
        {/* <nav className="ml-auto flex flex-row gap-3">
          <ExampleLoadForm className="flex-grow" />
          <Separator orientation="vertical" />
        </nav> */}
      </div>
    </header>
  );
}
