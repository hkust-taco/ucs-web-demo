import { LanguageSupport } from "@codemirror/language";
import { mlscriptLanguage } from "./language";
import { mlscriptCompletion } from "./completion";

export function mlscript() {
  return new LanguageSupport(mlscriptLanguage, [mlscriptCompletion]);
}
