import { Post } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createTask"
  | "editTask"
  | "deleteTask";

interface ModalData {
  id?: string;
  text?: string;
  title?: string;
  done?: boolean;
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
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
