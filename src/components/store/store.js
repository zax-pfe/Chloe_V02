import { create } from "zustand";

export const useSceneStore = create((set) => ({
  isSceneReady: false,
  setSceneReady: () => set({ isSceneReady: true }),
}));

export const usePieceStore = create((set) => ({
  selectedPiece: null,
  isModalOpen: false,
  openPiece: (piece) => set({ selectedPiece: piece, isModalOpen: true }),
  closePiece: () => set({ isModalOpen: false }),
  clearPiece: () => set({ selectedPiece: null }),
}));
