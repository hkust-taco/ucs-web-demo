import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import "@fontsource-variable/jetbrains-mono/wght-italic.css";
import "@fontsource-variable/jetbrains-mono";
import { Provider as JotaiProvider } from "jotai";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ultimate Conditional Syntax of MLscript",
  description: "The web demo of ultimate conditional syntax of MLscript.",
};

const ADOBE_FONTS_URL: string | null =
  typeof process.env.ADOBE_FONTS_URL === "string"
    ? process.env.ADOBE_FONTS_URL
    : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {ADOBE_FONTS_URL === null ? null : (
          <link rel="stylesheet" href={ADOBE_FONTS_URL} />
        )}
      </head>
      <body className={cn(inter.className, "w-screen h-screen")}>
        <JotaiProvider>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
