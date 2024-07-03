"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { BookOpenTextIcon, FishIcon } from "lucide-react";
import { TutorialButton } from "./tutorial";
import { useSetSelectedExample } from "@/lib/store/example";
import { Example, advancedExamples, basicExamples } from "@/lib/examples";
import { exampleIconMap } from "./exampleIcons";
import { Separator } from "../ui/separator";
import { LanguageTutorial } from "@/lib/tutorials/LanguageTutorial";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export type MenuProps = NavigationMenuProps;

export function Menu(props: MenuProps) {
  const setSelectedExample = useSetSelectedExample();
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList>
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>Basic Examples</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <FishIcon className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components that you can copy and
                      paste into your apps. Accessible. Customizable. Open
                      Source.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Basic Examples</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {basicExamples.map((example) => (
                <ExampleItem
                  key={example.name}
                  example={example}
                  onClick={() => setSelectedExample(example)}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Advanced Examples</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {advancedExamples.map((example) => (
                <ExampleItem
                  key={example.name}
                  example={example}
                  onClick={() => setSelectedExample(example)}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <Separator className="h-8" orientation="vertical" />
        <NavigationMenuItem>
          <LanguageTutorial
            className={cn(
              "select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              navigationMenuTriggerStyle()
            )}
            variant="link"
          />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <TutorialButton
            className={cn(
              "select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              navigationMenuTriggerStyle()
            )}
            variant="link"
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

type ListItemProps = React.ComponentPropsWithoutRef<"a"> & {
  icon?: React.ReactNode;
};

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

type ExampleItemProps = React.ComponentPropsWithoutRef<"button"> & {
  example: Example;
};
const ExampleItem = React.forwardRef<
  React.ElementRef<"button">,
  ExampleItemProps
>(({ className, example, ...props }, ref) => {
  const Icon = exampleIconMap.get(example.id);
  return (
    <li>
      <NavigationMenuItem asChild>
        <button
          ref={ref}
          className={cn(
            "border border-border border-dashed flex flex-row gap-2 w-full h-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {Icon === undefined ? null : (
            <div className="w-6 h-6">
              <Icon className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col gap-1.5 h-full pb-1.5">
            <div className="text-base font-medium leading-none">
              <span>{example.name}</span>
            </div>
            <p className="line-clamp-3 text-sm leading-snug text-muted-foreground">
              {example.description}
            </p>
            <div className="mt-auto self-end">
              {example.location === undefined ? null : (
                <span className="text-xs font-semibold uppercase px-1 py-0.5 bg-muted text-muted-foreground rounded-sm">
                  {example.location}
                </span>
              )}
            </div>
          </div>
        </button>
      </NavigationMenuItem>
    </li>
  );
});
ExampleItem.displayName = "ExampleItem";
