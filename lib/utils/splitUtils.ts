import { CoreSplit, SourceSplit } from "@mlscript/ucs-demo-build";

export function splitLength(split: SourceSplit | CoreSplit): number {
  let n = 0;
  let t = split;
  while (true) {
    switch (t.type) {
      case "Cons":
      case "Let":
        n++;
        t = t.tail;
        break;
      case "Else":
        n++;
        return n;
      case "Nil":
        return n;
    }
  }
}
