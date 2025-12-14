import { useStore as zustandUseStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import type {
  ILoginActions,
  ILoginInitialState,
} from "../../features/login/sliceStore/loginSlice";
import loginSlice from "../../features/login/sliceStore/loginSlice";

export type TGlobalInitialState = ILoginInitialState;

export type TGlobalActions = ILoginActions;

export type Store = ReturnType<(typeof slices)["loginSlice"]>;

export type StateCallback = (state: TGlobalInitialState) => TGlobalInitialState;

export type SetCallback<T> = (set: (state: T) => void) => void;

export const slices = {
  loginSlice: loginSlice.slice,
};

export const vanillaStore = createStore(
  immer<Store>((set) => ({
    ...loginSlice.slice(set as SetCallback<ILoginInitialState>),
  }))
);

export const useStore = zustandUseStore;
