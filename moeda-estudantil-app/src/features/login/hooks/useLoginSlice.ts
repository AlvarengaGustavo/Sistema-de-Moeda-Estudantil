import { useSliceAction, useSliceState } from "../../../shared/hooks/useStore";
import type {
  ILoginActions,
  ILoginInitialState,
} from "../sliceStore/loginSlice";

export const useLoginSlice = () => {
  const authenticatedUser = useSliceState<
    ILoginInitialState,
    "authenticatedUser"
  >("authenticatedUser");

  const setAuthenticatedUser = useSliceAction<
    ILoginActions,
    "setAuthenticatedUser"
  >("setAuthenticatedUser");

  return {
    authenticatedUser,
    setAuthenticatedUser,
  };
};
