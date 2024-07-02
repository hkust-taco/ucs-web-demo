import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { Example } from "../examples";

export const selectedExampleAtom = atom<Example | null>(null);

export function useSelectedExampleState() {
  return useAtom(selectedExampleAtom);
}

export function useSetSelectedExample() {
  return useSetAtom(selectedExampleAtom);
}

export function useSelectedExample() {
  return useAtomValue(selectedExampleAtom);
}
