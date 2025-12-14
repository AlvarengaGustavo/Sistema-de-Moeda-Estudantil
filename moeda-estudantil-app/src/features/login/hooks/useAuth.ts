import { useMutation } from "@tanstack/react-query";
import { MUTATION_QUERY_KEYS } from "../utils/constants";
import loginManagerInstance from "../services";

export const useAuth = (onSuccess: (token: string) => void) => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: MUTATION_QUERY_KEYS.login,
    mutationFn: (data: { email: string; password: string }) =>
      loginManagerInstance.login(data.email, data.password),
    onSuccess: onSuccess,
  });

  return { mutateAsync, isPending };
};
