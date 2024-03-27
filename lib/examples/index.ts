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

mapPartition(x => if x > 0 then Right(x) else Left(x), xs)`,
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
    Nil then
      if ys is Nil then Some(Nil) else None

let xs = 1 :: 2 :: 3 :: Nil
let ys = 4 :: 5 :: 6 :: Nil

zipWith((x, y) => (x + y) * 2, xs, ys)
`,
    builtin: true,
  },
];
