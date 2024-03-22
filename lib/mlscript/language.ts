import { LRLanguage } from "@codemirror/language";
import { parser } from "./parser";
// import { foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      "class trait module type fun let val": t.definitionKeyword,
      "abstract virtual": t.keyword,
      "if then else and": t.controlKeyword,
      Identifier: t.variableName,
      Boolean: t.bool,
      Number: t.number,
      String: t.string,
      LineComment: t.lineComment,
      "( )": t.paren,
      "[ ]": t.squareBracket,
      "{ }": t.brace,
    }),
    // indentNodeProp.add({
    //   Application: (context) =>
    //     context.column(context.node.from) + context.unit,
    // }),
    // foldNodeProp.add({
    //   Application: foldInside,
    // }),
  ],
});

export const mlscriptLanguage = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: { line: "//" },
  },
});
