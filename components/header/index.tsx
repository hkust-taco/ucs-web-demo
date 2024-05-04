// import { SettingsButton } from "../settings";
import { TutorialButton } from "./tutorial";

export function Header() {
  return (
    <header className="header bg-gray-100 dark:bg-gray-950">
      <div className="px-4 flex h-14 items-center">
        <h1 className="text-lg font-medium select-none">
          <span>Ultimate Conditional Syntax</span>{" "}
          <span className="text-muted-foreground">Web Demo</span>
        </h1>
        <nav className="ml-auto flex flex-row gap-3">
          {/* <SettingsButton /> */}
          <TutorialButton />
        </nav>
      </div>
    </header>
  );
}
