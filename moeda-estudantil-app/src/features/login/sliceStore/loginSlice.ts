import type { SetCallback } from "../../../shared/store/store";
import type { IUser } from "../types/IUser";

export interface ILoginInitialState {
  authenticatedUser?: IUser;
}

export type ILoginActions = ReturnType<typeof actions>;

const initialState: ILoginInitialState = {
  authenticatedUser: undefined,
};

const actions = (set: SetCallback<ILoginInitialState>) => ({
  setAuthenticatedUser: (user?: IUser) =>
    set((state) => {
      state.authenticatedUser = user;
    }),
});

const slice = (set: SetCallback<ILoginInitialState>) => ({
  ...initialState,
  ...actions(set),
});

const loginSlice = {
  slice,
  initialState,
};

export default loginSlice;
