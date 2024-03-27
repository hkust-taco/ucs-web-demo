import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCallback, useMemo, useState } from "react";

export type ConfirmDialogProps = {
  onConfirm?: (() => void) | null;
  onClose?: () => void;
};

export function ConfirmDialog({
  onConfirm = null,
  onClose,
}: ConfirmDialogProps) {
  const handleConfirm = useCallback(() => {
    onConfirm?.();
    onClose?.();
  }, [onConfirm, onClose]);
  return (
    <AlertDialog open={onConfirm !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Please note, this will clear the current editor&apos;s content, and
            it will be irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export type UseConfirmDialogResult = {
  showDialog: (action: () => void) => void;
  dialogProps: ConfirmDialogProps;
};

export function useConfirmDialog(): UseConfirmDialogResult {
  const [action, setAction] = useState<[() => void] | null>(null);
  const show = useCallback((action: () => void) => {
    console.log("here", action);
    setAction([action]);
  }, []);
  const hide = useCallback(() => {
    setAction(null);
  }, []);
  return {
    showDialog: show,
    dialogProps: useMemo(
      () => ({ onConfirm: action?.[0], onClose: hide }),
      [action, hide]
    ),
  };
}
