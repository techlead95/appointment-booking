"use client";

import { Dialog } from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react";

interface DialogContextValue {
  openDialog: (props: DialogProps) => () => void;
}

interface DialogProviderProps {
  closeDuration?: number;
}

interface DialogState {
  open?: boolean;
  props: DialogProps;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export const DialogProvider = ({
  children,
  closeDuration = 300,
}: PropsWithChildren<DialogProviderProps>) => {
  const [dialogs, setDialogs] = useState<Record<string, DialogState>>({});

  const closeModal = useCallback(
    (id: string) => {
      setDialogs((prev) => ({
        ...prev,
        [id]: { ...prev[id], open: false },
      }));

      setTimeout(() => {
        setDialogs((prev) => {
          const newDialogs = { ...prev };
          delete newDialogs[id];

          return newDialogs;
        });
      }, closeDuration);
    },
    [closeDuration]
  );

  const openDialog = useCallback(
    (props: DialogProps) => {
      const id = Date.now().toString();

      setDialogs((prev) => ({
        ...prev,
        [id]: { props, open: true },
      }));

      return () => closeModal(id);
    },
    [closeModal]
  );

  const contextValue = useMemo(() => ({ openDialog }), [openDialog]);

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      {Object.entries(dialogs).map(([id, { open, props }]) => {
        const modalProps = {
          ...props,
          open: open,
          onOpenChange: () => closeModal(id),
        };

        return <Dialog key={id} {...modalProps} />;
      })}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
};
