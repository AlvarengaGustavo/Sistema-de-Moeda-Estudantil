import { useMutation } from "@tanstack/react-query";
import companiesManagerInstance from "../services";

export const useUpdateCompany = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation<
    unknown,
    unknown,
    {
      id: string;
      name: string;
      email: string;
      cnpj: string;
      isActive: boolean;
    }
  >({
    mutationKey: ["update-company"],
    mutationFn: ({ id, name, email, cnpj, isActive }) =>
      companiesManagerInstance.updateCompany(id, name, email, cnpj, isActive),
  });

  return {
    isPending,
    error,
    mutateAsync,
    mutate,
  };
};
