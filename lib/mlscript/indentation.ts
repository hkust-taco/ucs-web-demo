//!trackIndent

import { ContextTracker, InputStream } from "@lezer/lr";
import { ExternalTokenizer } from "@lezer/lr";
import {
  dedent,
  indent,
  blankLineStart,
  newline,
  newlineBeforeElse,
} from "./mlscript.grammar.terms";

const log =
  process.env.VITEST === "true" ? console.log.bind(console) : () => {};

class IndentLevel {
  public hash: number;
  constructor(public parent: IndentLevel | null, public depth: number) {
    this.hash =
      (parent ? (parent.hash + parent.hash) << 8 : 0) + depth + (depth << 4);
  }
}

export const trackIndent = new ContextTracker({
  start: new IndentLevel(null, 0),
  shift(context, term, stack, input) {
    log(`Indentation tracker was called (depth: ${context.depth})`);
    if (term == indent) {
      log(`• Found indent. New depth: ${stack.pos - input.pos - 1}`);
      return new IndentLevel(context, stack.pos - input.pos - 1);
    } else if (term == dedent) {
      log(`• Found dedent`);
      return context.parent!;
    } else {
      log(`• Term ` + `\`${stack.parser.getName(term)}\`` + ` was shifted`);
      return context;
    }
  },
  hash: (context) => context.hash,
});

//!indentation

const EOF = -1,
  NEWLINE = 10,
  SPACE = 32,
  TAB = 9,
  ASTERISK = 42,
  SLASH = 47,
  LETTER_E = 101,
  LETTER_L = 108,
  LETTER_S = 115;

export const indentation = new ExternalTokenizer((input, stack) => {
  log("External tokenizer was called");
  if (input.next === EOF && stack.context.depth > 0) {
    log("• Accepted dedent");
    input.acceptToken(dedent);
    return;
  }
  // Check if it is at the beginning of the file or the line.
  // const prev = input.peek(-1)
  const next = input.next;
  // We should parse indentation if:
  // 1. previous character is EOF, which means we are at the beginning of the file;
  // 2. the next character is NEWLINE, which means we are at the end of the line.
  // if (prev !== EOF && next !== NEWLINE) {
  //   log(
  //     `• Stop because the previous character is not EOF ${charAndCode(prev)}`
  //   );
  //   log(`  and the next character is not NEWLINE: ${charAndCode(next)}`);
  //   return;
  // }

  // Consume the NEWLINE in case 2.
  if (next === NEWLINE) {
    log(`• Continue because the next character is ${charAndCode(next)}`);
    input.advance();
  } else {
    return;
  }
  // if (prev === EOF) {
  //   log(`• Continue because the previous character is ${charAndCode(prev)}`);
  // }
  // Counting whitespaces.
  let spaces = 0;
  while (input.next === SPACE || input.next == TAB) {
    input.advance();
    spaces++;
  }
  log(`• Skipped ${spaces} spaces. Next: ${charAndCode(input.next)}`);
  if (
    // Found linefeed or a single line comment.
    (input.next === NEWLINE ||
      input.next === EOF ||
      startsWithComments(input)) &&
    (log(`• Can shift blankLineStart: ${stack.canShift(blankLineStart)}`),
    stack.canShift(blankLineStart))
  ) {
    log("• Accepted `blankLineStart` token");
    input.acceptToken(blankLineStart);
  } else if (spaces > stack.context.depth) {
    log("• Accepted indent");
    input.acceptToken(indent);
  } else if (spaces < stack.context.depth) {
    log("• Accepted dedent");
    input.acceptToken(dedent, -(spaces + 1));
  } else if (spaces === stack.context.depth) {
    if (
      input.next === LETTER_E &&
      input.peek(1) === LETTER_L &&
      input.peek(2) === LETTER_S &&
      input.peek(3) === LETTER_E &&
      stack.canShift(newlineBeforeElse)
    ) {
      log("• Accepted newlineBeforeElse");
      input.acceptToken(newlineBeforeElse);
    } else {
      log("• Accepted newline");
      input.acceptToken(newline);
    }
  } else {
    log("• No token accepted");
  }
});

function char(codePoint: number): string {
  if (codePoint < 0) return '"\u220E"';
  return JSON.stringify(String.fromCharCode(codePoint));
}

function charAndCode(codePoint: number): string {
  return `${char(codePoint)} (${codePoint})`;
}

function startsWithComments(input: InputStream): boolean {
  return (
    input.next === SLASH &&
    (input.peek(1) === SLASH || input.peek(1) === ASTERISK)
  );
}
