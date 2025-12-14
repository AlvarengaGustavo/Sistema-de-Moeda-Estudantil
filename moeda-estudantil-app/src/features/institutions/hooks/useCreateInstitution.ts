import { useMutation } from "@tanstack/react-query";
import institutionsManagerInstance from "../services";

export const useCreateInstitution = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation({
    mutationKey: ["create-institution"],
    mutationFn: (newInstitutionName: string) =>
      institutionsManagerInstance.createInstitution(newInstitutionName),
  });

  return {
    isPending,
    error,
    mutateAsync,
    mutate,
  };
};
