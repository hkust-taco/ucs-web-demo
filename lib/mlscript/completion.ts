import { completeFromList } from "@codemirror/autocomplete";
import { mlscriptLanguage } from "./language";

export const mlscriptCompletion = mlscriptLanguage.data.of({
  autocomplete: completeFromList([
    { label: "class", type: "keyword" },
    { label: "trait", type: "keyword" },
    { label: "module", type: "keyword" },
    { label: "type", type: "keyword" },
    { label: "let", type: "keyword" },
    { label: "fun", type: "keyword" },
    { label: "val", type: "keyword" },
  ]),
});
