import { useMutation } from "@tanstack/react-query";
import registerManagerInstance from "../services";
import type { ICreateCompany } from "../../companies/types/ICompany";

export const useCreateCompany = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["create-company"],
    mutationFn: async (data: ICreateCompany) => {
      await registerManagerInstance.createCompany(
        data.email,
        data.name,
        data.cnpj,
        data.password
      );
    },
  });

  return {
    isPending,
    error,
    mutate,
    mutateAsync,
  };
};
