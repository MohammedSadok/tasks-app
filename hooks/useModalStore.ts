import { create } from "zustand";

export type ModalType = "createTask" | "editTask" | "deleteTask";

interface ModalData {
  id: string;
  text: string;
  title: string;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: { text: "", title: "", id: "" },
  isOpen: false,
  onOpen: (type, data = { text: "", title: "", id: "" }) =>
    set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
