import { LRLanguage } from "@codemirror/language";
import { parser } from "./mlscript.grammar";
// import { foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      "declare class trait module type fun let val": t.definitionKeyword,
      "abstract virtual extends": t.keyword,
      "if then else and is rec": t.controlKeyword,
      BuildinType: t.special(t.typeName),
      Identifier: t.variableName,
      TypeName: t.className,
      TypeVariable: t.className,
      VariableName: t.variableName,
      Boolean: t.bool,
      BooleanLiteral: t.bool,
      Variance: t.modifier,
      PropertyName: t.special(t.variableName),
      ParameterName: t.special(t.variableName),
      VariablePattern: t.special(t.variableName),
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
