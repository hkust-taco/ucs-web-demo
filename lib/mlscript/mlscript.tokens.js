import { ContextTracker, ExternalTokenizer } from "@lezer/lr";
import {
  dedent as TOKEN_DEDENT,
  indent as TOKEN_INDENT,
  keep as TOKEN_KEEP,
} from "./index.terms";

class IndentLevel {
  /**
   * @param {IndentLevel | null} parent the parent context
   * @param {number} depth the number of spaces
   */
  constructor(parent, depth) {
    this.parent = parent;
    this.depth = depth;
    this.hash =
      (parent ? (parent.hash + parent.hash) << 8 : 0) + depth + (depth << 4);
  }
}

export const trackIndent = new ContextTracker({
  start: new IndentLevel(null, 0),
  shift(context, term, stack, input) {
    if (term === TOKEN_INDENT)
      return new IndentLevel(context, stack.pos - input.pos - 1);
    else if (term === TOKEN_DEDENT) return context.parent;
    else return context;
  },
  hash: (context) => context.hash,
});

const NEWLINE = 10;

export const betterIndentation = new ExternalTokenizer((input, stack) => {
  // console.log(`indentation at ${input.pos}`);
  const cDepth = stack.context.depth;
  // console.log(`> Current depth: ${cDepth}`);
  if (input.next < 0 && cDepth > 0) {
    // if the input is at the end of the file and the depth is not zero
    // console.log("> We are at the end of the file");
    // console.log("> Emit DEDENT");
    input.acceptToken(TOKEN_DEDENT);
  } else if (input.next === NEWLINE) {
    input.advance();
    const depth = skipSpaces(input);
    if (input.next === NEWLINE || startOfComment(input) || depth === cDepth) {
      input.acceptToken(TOKEN_KEEP);
    } else if (depth < cDepth) {
      // console.log("> Emit DEDENT");
      input.acceptToken(TOKEN_DEDENT);
    } else {
      // console.log("> Emit INDENT");
      input.acceptToken(TOKEN_INDENT);
    }
  } else if (input.peek(-1) === NEWLINE) {
    const depth = skipSpaces(input);
    if (input.next === NEWLINE || startOfComment(input) || depth === cDepth) {
      input.acceptToken(TOKEN_KEEP);
    } else if (depth < cDepth) {
      // console.log("> Emit DEDENT");
      input.acceptToken(TOKEN_DEDENT);
    } else {
      // console.log("> Emit INDENT");
      input.acceptToken(TOKEN_INDENT);
    }
  }
});

const SLASH = 47;

/**
 * @param {import("@lezer/lr").InputStream} input
 * @returns {boolean} whether the input starts with a comment
 */
function startOfComment(input) {
  let next;
  return (
    input.next === SLASH &&
    ((next = input.peek(1)) === SLASH || next === asterisk)
  );
}

/**
 * @param {import("@lezer/lr").InputStream} input
 * @returns {number} the number of spaces skipped
 */
function skipSpaces(input) {
  let spaces = 0;
  while (input.next !== NEWLINE && isSpace(input.next)) {
    input.advance();
    spaces++;
  }
  return spaces;
}

const SPACE_CODE_POINTS = new Set([
  9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197,
  8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288,
]);

function isSpace(code) {
  return SPACE_CODE_POINTS.has(code);
}
