import { useMutation } from "@tanstack/react-query";
import institutionsManagerInstance from "../services";

export const useUpdateInstitution = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation<
    unknown,
    unknown,
    { id: string; newInstitutionName: string }
  >({
    mutationKey: ["update-institution"],
    mutationFn: ({
      id,
      newInstitutionName,
    }: {
      id: string;
      newInstitutionName: string;
    }) => institutionsManagerInstance.updateInstitution(id, newInstitutionName),
  });

  return {
    isPending,
    error,
    mutateAsync,
    mutate,
  };
};
