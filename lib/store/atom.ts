import { atom } from "jotai";
import { z } from "zod";

type Update<T> = ((value: T) => T) | T;

function isUpdateFunction<T>(update: Update<T>): update is (value: T) => T {
  return typeof update === "function";
}

export function atomWithLocalStorage<T extends z.ZodType>(
  key: string,
  valueSchema: T,
  defaultValue: z.output<T>
) {
  type O = z.output<T>;
  const readValue = (): O => {
    if (!('localStorage' in globalThis)) return defaultValue;
    const item = localStorage.getItem(key);
    if (item !== null) {
      try {
        const raw = JSON.parse(item);
        const cooked = valueSchema.parse(raw);
        return cooked;
      } catch (e) {
        console.error(`Error parsing localStorage item ${key}:`, e);
        return defaultValue;
      }
    }
    return defaultValue;
  };
  const baseAtom = atom<O>(readValue());
  const derivedAtom = atom<O, [Update<O>], void>(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue = isUpdateFunction(update)
        ? update(get(baseAtom))
        : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
}
