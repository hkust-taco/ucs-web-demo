import { z } from "zod";

export const ExampleSchema = z.object({
  group: z.string().default("user"),
  name: z.string(),
  source: z.string().default(""),
  builtin: z.boolean().default(false),
});

export type Example = z.output<typeof ExampleSchema>;

export const examples: Example[] = [
  {
    group: "General",
    name: "guards",
    source: `abstract class Option[T]
class Some[T](value: T) extends Option[T]
module None extends Option[nothing]

fun filter(x, p) =
  if x is
    Some(xv) and p(xv) then x
    else None
`,
    builtin: true,
  },
  {
    group: "General",
    name: "sign",
    source: [
      "fun sign(x) = if x",
      "  < 0 then -1",
      "  > 0 then 1",
      "  else then 0",
      "",
      "sign(42)",
      "sign(0)",
      "sign(-10)",
      "",
    ].join("\n"),
    builtin: true,
  },
  {
    group: "List",
    name: "mapPartition",
    source: `class Pair[A, B](first: A, second: B)

abstract class Either[out A, out B]
class Left[out A, out B](value: A) extends Either[A, B]
class Right[out A, out B](value: B) extends Either[A, B]

abstract class List[out T]: (Cons[T] | Nil)
class Cons[out T](val head: T, val tail: List[T]) extends List[T]
module Nil extends List[nothing]

fun (::) cons(head, tail) = Cons(head, tail)

fun mapPartition(f, xs) =
  if xs is
    Nil then Pair(Nil, Nil)
    Cons(x, xs) and mapPartition(f, xs) is Pair(l, r) and f(x) is
      Left(v) then Pair(Cons(v, l), r)
      Right(v) then Pair(l, Cons(v, r))

let xs = 1 :: -2 :: 3 :: -4 :: 5 :: -6 :: Nil

mapPartition((x => if x > 0 then Right(x) else Left(x)), xs)`,
    builtin: true,
  },
  {
    group: "List",
    name: "zipWith",
    source: `abstract class Option[T]
class Some[T](value: T) extends Option[T]
module None extends Option[nothing]

abstract class List[out T]: (Cons[T] | Nil)
class Cons[out T](val head: T, val tail: List[T]) extends List[T]
module Nil extends List[nothing]

fun (::) cons(head, tail) = Cons(head, tail)

fun zipWith(f, xs, ys) =
  if xs is
    Cons(x, xs) and ys is
      Cons(y, ys) and
        zipWith(f, xs, ys) is
          Some(tail) then Some(Cons(f(x, y), tail))
          None then None
      Nil then None
    Nil and ys is
      Nil then Some(Nil)
      else None

let xs = 1 :: 2 :: 3 :: Nil
let ys = 4 :: 5 :: 6 :: Nil

zipWith((x, y) => (x + y) * 2, xs, ys)
`,
    builtin: true,
  },
  {
    group: "Real-world Examples",
    name: "JSON Parser",
    source: `type NStr = Str & {
  length: Int,
  at: Int -> NStr,
  charAt: Int -> NStr,
  charCodeAt: Int -> Int,
  slice: (Int, Int) -> NStr,
  startsWith: (Str, Int) -> Bool,
  endsWith: Str -> Bool,
  split: Str -> Array[NStr],
  trim: () -> NStr,
  trimStart: () -> NStr,
  trimEnd: () -> NStr,
  padStart: (Int, Str) -> NStr,
  padEnd: (Int, Str) -> NStr,
  repeat: Int -> NStr,
  indexOf: Str -> Int,
  lastIndexOf: Str -> Int,
  includes: Str -> Bool,
  localeCompare: Str -> Int
}
declare fun String: (anything -> NStr) & { fromCodePoint: Int -> NStr }
fun (++) strcat(a, b) = String of concat(a)(b)
fun (<*) strlt(a: NStr, b: NStr) = a.localeCompare(b) < 0
fun (*>) strgt(a: NStr, b: NStr) = a.localeCompare(b) > 0

declare fun Math: { log10: Num -> Num, floor: Num -> Num, ceil: Num -> Num }

let (+.) numAdd' = numAdd
let (-.) numSub' = numSub
let (*.) numMul' = numMul

fun (!==) notEqual(x, y) = not(x === y)
declare fun parseInt: (Str, Int) -> Int

abstract class List[out T]: Cons[T] | Nil
class Cons[out T](head: T, tail: List[T]) extends List[T]
module Nil extends List
fun (::) cons(head: 'T, tail: List['T]): List['T] = Cons(head, tail)
fun reverse(l: List['A]): List['A] =
  let rec r(l', l) = if l is Cons(x, xs) then r(x :: l', xs) else l'
  r(Nil, l)
fun join(sep: Str, xs: List['B]) = if xs is
  Cons(x, Nil) then toString(x)
  Cons(x, xs) then toString(x) ++ sep ++ join(sep, xs)
  Nil then ""
fun showList(xs: List['C]) = "[" ++ join(", ", xs) ++ "]"
fun map(f: 'D -> 'E, xs: List['D]): List['E] = if xs is
  Cons(x, xs) then f(x) :: map(f, xs)
  Nil then Nil
fun equalList(xs: List['A], ys: List['A], equal: ('A, 'A) -> Bool): Bool = if xs is
  Cons(x, xs') and ys is Cons(y, ys') then equal(x, y) and equalList(xs', ys', equal)
  Nil and ys is Nil then true
  else false

abstract class Option[out A]: Some[A] | None
class Some[out A](value: A) extends Option[A]
module None extends Option

fun (->) makePair(a, b) = [a, b]

abstract class ListMap[K, out V]: (ConsMap[K, V] | NilMap)
class ConsMap[K, out V](head: [K, V], tail: ListMap[K, V]) extends ListMap[K, V]
module NilMap extends ListMap
fun containsKey(map: ListMap['K, 'V], key: 'K): Bool = if map is
  ConsMap([k, _], _) and k === key then true
  ConsMap(_, tail) then containsKey(tail, key)
  NilMap then false
fun (:+) insert(map, entry) = if map is
  ConsMap(entry', map) and
    entry'.0 === entry.0 then ConsMap(entry, map)
    else ConsMap(entry', insert(map, entry))
  NilMap then ConsMap(entry, NilMap)
fun showMap(map) =
  let showEntry([k, v]) = toString(k) ++ " -> " ++ toString(v)
  let rec aux(map) = if map is
    ConsMap(last, NilMap) then showEntry(last)
    ConsMap(head, tail) then showEntry(head) ++ ", " ++ aux(tail)
    NilMap then ""
  if map is NilMap then String("{}") else "{ " ++ aux(map) ++ " }"

showMap of NilMap
showMap of NilMap :+ ["b", 2]
showMap of NilMap :+ [1, "a"] :+ [2, "b"]
showMap of NilMap :+ [1, "a"] :+ [2, "b"] :+ [1, "c"]

abstract class JsonValue: JsonNumber | JsonString | JsonArray | JsonObject | JsonBoolean | JsonNull
class JsonNumber(value: Num) extends JsonValue
class JsonString(value: Str) extends JsonValue
class JsonArray(value: List[JsonValue]) extends JsonValue
class JsonObject(value: ListMap[Str, JsonValue]) extends JsonValue
class JsonBoolean(value: Bool) extends JsonValue
module JsonNull extends JsonValue

class ParserState(val text: NStr, val at: Int) {
  fun drained: Bool = at === text.length
  fun peek: Option[NStr] = if drained then None else Some(text.charAt(at))
  fun peekCode: Option[Int] = if drained then None else Some(text.charCodeAt(at))
  fun next: ParserState = if drained then this else ParserState(text, at + 1)
  fun nextDigit: Option[[Num, ParserState]] = if peekCode is
    Some(ch) and 48 <= ch and ch <= 57 then Some([ch - 48, next])
    else None
  fun match(prefix: Str): Option[ParserState] =
    let prefix' = String(prefix)
    if
      prefix'.length > text.length - at then None
      text.startsWith(prefix', at) then Some(ParserState(text, at + prefix'.length))
      else None
  fun rest: NStr = text.slice(at, text.length)
}
fun showParserState(state) = "ParserState(_, " ++ toString(state.at) ++ ")"
fun success: forall 't: ('t, ParserState) -> ParseResult['t]
fun success = (value, state) => Success(value, state)
fun failure: forall 't: Str -> ParseResult[nothing]
fun failure = error => Failure(error)
abstract class ParseResult[out T]: (Success[T] | Failure) {
  virtual fun flatMap(f: (T, ParserState) -> ParseResult['U]): ParseResult['U]
  virtual fun map(f: T -> 'U): ParseResult['U]
}
class Success[out T](value: T, state: ParserState) extends ParseResult[T] {
  fun flatMap(f) = f(value, state)
  fun map(f) = success(f(value), state)
}
class Failure(error: Str) extends ParseResult[nothing] {
  fun flatMap(_) = failure(error)
  fun map(_) = failure(error)
}
fun showParseResult(result) = if result is
  Success(value, state) then "Success after " ++ toString(state.at) ++ ": " ++ toString(value)
  Failure(error) then "Failure: " ++ toString(error)

fun isWhiteSpace(ch: NStr): Bool =
  (ch === " ") || (ch === "\n") || (ch === "\r") || (ch === "\t")
fun skipWhiteSpace(state: ParserState): ParserState = if state.peek is
  Some(ch) and isWhiteSpace(ch) then skipWhiteSpace(state.next)
  else state

(skipWhiteSpace of ParserState(String(" \n\r\t"), 0)).at

fun isDigit(ch) = sge(ch, "0") && sle(ch, "9")

fun parseNumber(state: ParserState): ParseResult[Num] =
  let toFraction(n) = n / (10 ** Math.ceil of Math.log10 of n)
  let parseNegative(state): ParseResult[Bool] = if state.peek is
    Some("-") then Success(true, state.next)
    else Success(false, state)
      let parseDigits(state): ParseResult[Num] =
        let rec aux(acc, state) = if state.nextDigit is
      Some([digit, state']) then aux((acc *. 10) +. digit, state')
      None then [acc, state]
        if state.nextDigit is
      Some([digit, state']) and aux(digit, state') is
        [num, state''] then Success(num, state'')
      None then Failure("expected one or more decimal digits")
      let parseIntegral(state): ParseResult[Num] = if state.nextDigit is
    Some([0, state']) then Success(0, state')
    else parseDigits(state)
      let parseFraction(state): ParseResult[Num] = if state.peek is
    Some(".") then parseDigits(state.next).map of toFraction
    else Success(0, state)
  let parseExponent(state): ParseResult[Num] =
    let parseSign(state): ParseResult[Bool] = if state.peek is
      Some("-") then Success(true, state.next)
      Some("+") then Success(false, state.next)
      else Success(false, state)
    if state.peek is Some(e) and (e === "e") || (e === "E") then
      parseSign(state.next).flatMap of (sign, state) =>
        parseDigits(state).map of exponent =>
          if sign then 10 ** (0 -. exponent) else 10 ** exponent
    else
      Success(1, state)
  parseNegative(state).flatMap of (negative, state) =>
    parseIntegral(state).flatMap of (integral, state) =>
      parseFraction(state).flatMap of (fraction, state) =>
        parseExponent(state).flatMap of (exponent, state) =>
          let value = (integral +. fraction) *. exponent
          Success of (if negative then (0 -. value) else value), state

showParseResult of parseNumber of ParserState of String("0"), 0
showParseResult of parseNumber of ParserState of String("0234"), 0
showParseResult of parseNumber of ParserState of String("123"), 0
showParseResult of parseNumber of ParserState of String("12.34"), 0
showParseResult of parseNumber of ParserState of String("1e10"), 0
showParseResult of parseNumber of ParserState of String("1E5"), 0
showParseResult of parseNumber of ParserState of String("1E-1"), 0
showParseResult of parseNumber of ParserState of String("1E+1"), 0

fun parseString(state: ParserState): ParseResult[Str] =
  let rec parseCodePoint(n, acc, state) = if
    n === 0 then Success(acc, state)
    state.peekCode is Some(code) and
      48 <= code and code <= 57 then parseCodePoint(n - 1, acc * 16 + code - 48, state.next)
      65 <= code and code <= 70 then parseCodePoint(n - 1, acc * 16 + code - 55, state.next)
      97 <= code and code <= 102 then parseCodePoint(n - 1, acc * 16 + code - 87, state.next)
      else Failure("expect " ++ toString(n) ++ " hex digit(s) instead of '" ++ String.fromCodePoint(code) ++ "'")
    else Failure("expect " ++ toString(n) ++ " hex digit(s) instead of end of input")
  let rec parseContent(acc, state) = if state.peek is
    Some("\"") then Success(acc, state.next)
    Some("\\") and
      let state' = state.next
      state'.peek is
        Some("\"") then parseContent(acc ++ "\"", state'.next)
        Some("\\") then parseContent(acc ++ "\\", state'.next)
        Some("/") then parseContent(acc ++ "/", state'.next)
        Some("b") then parseContent(acc ++ "\b", state'.next)
        Some("f") then parseContent(acc ++ "\f", state'.next)
        Some("n") then parseContent(acc ++ "\n", state'.next)
        Some("r") then parseContent(acc ++ "\r", state'.next)
        Some("t") then parseContent(acc ++ "\t", state'.next)
        Some("u") then
          parseCodePoint(4, 0, state'.next).flatMap of (codePoint, state) =>
            if codePoint < 0xD800 || 0xDFFF < codePoint then
              parseContent(acc ++ String.fromCodePoint(codePoint), state)
            else Failure("invalid code point")
        else Failure("invalid escape sequence")
    Some(ch) then parseContent(acc ++ ch, state.next)
    None then Failure("expected '\"' instead of end of input")
  if state.peek is
    Some("\"") then parseContent("", state.next)
    Some(ch) then Failure("expected '\"' instead of '" ++ ch ++ "'")
    else Failure("expected '\"' instead of end of input")

showParseResult of parseString of ParserState of String("\"\""), 0
showParseResult of parseString of ParserState of String("\"abc\""), 0
showParseResult of parseString of ParserState of String("\"\\\"\""), 0
showParseResult of parseString of ParserState of String("\"\\\\\""), 0
showParseResult of parseString of ParserState of String("\"\\/\""), 0
showParseResult of parseString of ParserState of String("\"\\b\""), 0
showParseResult of parseString of ParserState of String("\""), 0
showParseResult of parseString of ParserState of String("\"\\u\""), 0
showParseResult of parseString of ParserState of String("\"\\u0\""), 0
showParseResult of parseString of ParserState of String("\"\\u004c\""), 0

fun parseTrue(state: ParserState): ParseResult[Bool] =
  if state.match("true") is
    Some(state) then Success(true, state)
    None then Failure("expected 'true'")
fun parseFalse(state: ParserState): ParseResult[Bool] =
  if state.match("false") is
    Some(state) then Success(false, state)
    None then Failure("expected 'false'")
fun parseNull(state: ParserState): ParseResult[()] =
  if state.match("null") is
    Some(state) then Success((), state)
    None then Failure("expected 'null'")

fun parseObjectEntry(state: ParserState): ParseResult[[Str, JsonValue]] =
  let state' = skipWhiteSpace(state)
  parseString(state').flatMap of (key, state) =>
    let state' = skipWhiteSpace(state)
    if state'.peek is
      Some(":") then
        parseValue(state'.next).flatMap of (value, state') =>
          Success([key, value], state')
      Some(ch) then Failure("expected ':' instead of '" ++ ch ++ "'")
      None then Failure("expected ':' instead of end of input")
    else Failure("expected ':' instead of end of input")
fun parseObject(state: ParserState): ParseResult[ListMap[Str, JsonValue]] =
  let rec parseObjectTail(acc: ListMap[Str, JsonValue], state: ParserState) =
    let state' = skipWhiteSpace(state)
    if state'.peek is
      Some(",") then
        parseObjectEntry(state'.next).flatMap of (entry, state') =>
          if containsKey(acc, entry.0) then
            Failure("duplicate key '" ++ toString(entry.0) ++ "'")
          else
            parseObjectTail(ConsMap(entry, acc), state')
      Some("}") then Success(acc, state'.next)
      Some(ch) then Failure("expected ',' or ']' instead of " ++ ch)
      None then Failure("expected ',' or ']' instead of end of input")
  let state' = skipWhiteSpace(state)
  if state'.peek is
    Some("}") then Success(NilMap, state'.next)
    None then Failure("expected ',' or ']' instead of end of input")
    else
      parseObjectEntry(state').flatMap of (head, state) =>
        parseObjectTail(ConsMap(head, NilMap), state)
fun parseArray(state: ParserState): ParseResult[List[JsonValue]] =
  let rec parseArrayTail(acc, state) =
    let state' = skipWhiteSpace(state)
    if state'.peek is
      Some(",") then
        parseValue(state'.next).flatMap of (value, state') =>
          parseArrayTail(value :: acc, state')
      Some("]") then Success(reverse(acc), state'.next)
      Some(ch) then Failure("expected ',' or ']' instead of " ++ ch)
      None then Failure("expected ',' or ']' instead of end of input")
  let state' = skipWhiteSpace(state)
  if state'.peek is
    Some("]") then Success(Nil, state'.next)
    None then Failure("expected ',' or ']' instead of end of input")
    else
      parseValue(state').flatMap of (head, state) =>
        parseArrayTail(head :: Nil, state)
fun parseValue(state: ParserState): ParseResult[JsonValue] =
  let state' = skipWhiteSpace(state)
  if state'.peek is
    Some(ch) and
      ch === "\"" then parseString(state').map of JsonString
      (ch === "-") || isDigit(ch) then parseNumber(state').map of JsonNumber
      ch === "[" then parseArray(state'.next).map of JsonArray
      ch === "{" then parseObject(state'.next).map of JsonObject
      ch === "t" then parseTrue(state').map of JsonBoolean
      ch === "f" then parseFalse(state').map of JsonBoolean
      ch === "n" then parseNull(state').map of _ => JsonNull
      else Failure("cannot recognize " ++ ch ++ " as the beginning of a JSON value")
    None then Failure("expected a JSON value instead of end of input")

fun parse(source: Str): ParseResult[JsonValue] =
  (parseValue of ParserState of String(source), 0).flatMap of (value, finalState) =>
    let shouldBeEnd = skipWhiteSpace of finalState
    if shouldBeEnd.drained then
      Success(value, shouldBeEnd)
    else
      Failure("expected end of input instead of: " ++ shouldBeEnd.rest)

fun stringify(value: JsonValue): Str =
  let stringifyObject(map) =
    let showEntry([k, v]) = "\"" ++ toString(k) ++ "\": " ++ stringify(v)
    let rec aux(map) = if map is
      ConsMap(last, NilMap) then showEntry(last)
      ConsMap(head, tail) then showEntry(head) ++ ", " ++ aux(tail)
      NilMap then ""
    if map is NilMap then String("{}") else "{ " ++ aux(map) ++ " }"
  if value is
    JsonNumber(n) then toString(n)
    JsonString(s) then "\"" ++ s ++ "\""
    JsonArray(xs) then "[" ++ join(", ", map(stringify, xs)) ++ "]"
    JsonObject(m) then stringifyObject(m)
    JsonBoolean(b) then if b then "true" else "false"
    JsonNull then "null"

fun showResult(result) = if result is
  Success(value, state) then "Success after " ++ toString(state.at) ++ ": " ++ stringify(value)
  Failure(error) then "Failure: " ++ toString(error)

showResult of parse of "null"
showResult of parse of "true"
showResult of parse of "false"
showResult of parse of "123"
showResult of parse of "\"abc\""
showResult of parse of "[1, 2, 3]"
showResult of parse of "{\"a\": 1, \"b\": 2}"
showResult of parse of "nul"
showResult of parse of "[1, 3, 5"
showResult of parse of "[1, 3, 5]"

showResult of parse of "{ \"origin\": { \"x\": 0, \"y\": 0 } }"
showResult of parse of "[   { \"origin\": { \"x\": 0, \"y\": 0 } , \"size\": { \"width\": 100, \"height\": 100 } }   ]"
showResult of parse of "{\"id\":\"658f34f88882211aa8679240\",\"children\":[{\"name\":\"Jo Rosales\",\"age\":8},{\"name\":\"Shawn Burke\",\"age\":7},{\"name\":\"Gomez Guthrie\",\"age\":10},{\"name\":\"Tandy Christensen\",\"age\":9},{\"name\":\"Jody Langley\",\"age\":3}],\"currentJob\":{\"title\":\"Developer\",\"salary\":\"mask;\"},\"jobs\":[{\"title\":\"medic\",\"salary\":\"R$ 6.400,90\"},{\"title\":\"teacher\",\"salary\":\"R$ 7.960,31\"}],\"maxRunDistance\":14.7,\"cpf\":\"713.763.356-03\",\"cnpj\":\"33.385.435/0001-50\",\"pretendSalary\":\"R$ 9.247,29\",\"age\":63,\"gender\":\"male\",\"firstName\":\"Parker\",\"lastName\":\"Case\",\"phone\":\"+55 (83) 95023-7077\",\"address\":\"14 Orient Avenue - Harmon, Northern Mariana Islands, Myanmar.\",\"hairColor\":\"yellow\"}"
`,
    builtin: true,
  },
];
