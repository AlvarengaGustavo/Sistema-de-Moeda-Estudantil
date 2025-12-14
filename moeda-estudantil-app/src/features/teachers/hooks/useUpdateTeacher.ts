import { useMutation } from "@tanstack/react-query";
import teachersManagerInstance from "../services";

export const useUpdateTeacher = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation<
    unknown,
    unknown,
    {
      id: string;
      name: string;
      department: string;
      email: string;
      cpf: string;
      institutionId: string;
      isActive: boolean;
      password?: string;
    }
  >({
    mutationKey: ["update-teacher"],
    mutationFn: ({
      id,
      name,
      department,
      email,
      cpf,
      institutionId,
      isActive,
      password,
    }) =>
      teachersManagerInstance.updateTeacher({
        id,
        name,
        department,
        email,
        cpf,
        institutionId,
        isActive,
        password,
      }),
  });

  return {
    isPending,
    error,
    mutateAsync,
    mutate,
  };
};
