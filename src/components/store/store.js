import { create } from "zustand";

export const usePieceStore = create((set) => ({
  selectedPiece: null,
  isModalOpen: false,
  openPiece: (piece) => set({ selectedPiece: piece, isModalOpen: true }),
  closePiece: () => set({ isModalOpen: false }),
  clearPiece: () => set({ selectedPiece: null }),
}));
