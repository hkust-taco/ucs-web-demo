import { Compartment } from "@codemirror/state";
import { EditorView } from "codemirror";
import { MutableRefObject, useEffect } from "react";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";

export const themeConfig = new Compartment();

export function useThemeAutoSwitch(
  editorRef: MutableRefObject<EditorView | null>
) {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const eventHandler = (event: MediaQueryListEvent) => {
      if (editorRef.current === null) return;
      if (event.matches) {
        editorRef.current.dispatch({
          effects: themeConfig.reconfigure(githubDark),
        });
      } else {
        editorRef.current.dispatch({
          effects: themeConfig.reconfigure(githubLight),
        });
      }
    };
    mediaQuery.addEventListener("change", eventHandler);
    return () => mediaQuery.removeEventListener("change", eventHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function getCurrentTheme() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return themeConfig.of(mediaQuery.matches ? githubDark : githubLight);
}
