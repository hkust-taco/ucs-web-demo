export type TranslationLogs = {
  parsing: string[];
  desugaring: string[];
  normalization: string[];
  postprocessing: string[];
};

const PARSING_INTRO = "Transformed UCS term:";
const DESUGARING_INTRO = "Desugared UCS term:";
const NORMALIZATION_INTRO = "Normalized UCS term:";
const POSTPROCESSING_INTRO = "Post-processed UCS term:";
const BAR = "|";

export function extractTranslationLogs(
  lines: string[]
): TranslationLogs | null {
  function find(predicate: (line: string) => boolean, start = 0) {
    for (let i = start; i < lines.length; i++) {
      if (predicate(lines[i])) return i;
    }
    return -1;
  }
  let start = find((line) => line.startsWith(PARSING_INTRO));
  if (start < 0) return null;
  let end = find((line) => line.startsWith(BAR), start);
  const parsing = lines.slice(start + 1, end);
  start = find((line) => line.startsWith(DESUGARING_INTRO), end);
  if (start < 0) return null;
  end = find((line) => line.startsWith(BAR), start);
  const desugaring = lines.slice(start + 1, end);
  start = find((line) => line.startsWith(NORMALIZATION_INTRO), end);
  if (start < 0) return null;
  end = find((line) => line.startsWith(BAR), start);
  const normalization = lines.slice(start + 1, end);
  start = find((line) => line.startsWith(POSTPROCESSING_INTRO), end);
  if (start < 0) return null;
  end = find((line) => line.startsWith(BAR), start);
  const postprocessing = lines.slice(start + 1, end);
  return { parsing, desugaring, normalization, postprocessing };
}
