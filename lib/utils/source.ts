export class Source {
  public readonly lines: string[];
  public readonly lineStartIndex: number[];
  constructor(public readonly source: string) {
    this.lines = source.split("\n");
    this.lineStartIndex = [];
    for (let i = 0, pos = 0; i < this.lines.length; i++) {
      this.lineStartIndex.push(pos);
      pos += this.lines[i].length + 1;
    }
  }

  slice(start: number, end: number): string {
    return this.source.slice(start, end);
  }

  lookup(pos: number): [line: number, column: number] {
    let left = 0, // closed interval
      right = this.lineStartIndex.length; // open interval
    while (left + 1 < right) {
      let mid = (left + right) >> 1;
      if (pos < this.lineStartIndex[mid]) right = mid;
      else left = mid;
    }
    const offset = pos - this.lineStartIndex[left];
    return [left + 1, offset + 1];
  }
}
