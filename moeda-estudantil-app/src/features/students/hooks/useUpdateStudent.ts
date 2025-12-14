import { useMutation } from "@tanstack/react-query";
import studentsManagerInstance from "../services";

export const useUpdateStudent = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation<
    unknown,
    unknown,
    {
      id: string;
      name: string;
      email: string;
      cpf: string;
      address: string;
      course: string;
      institutionId: string;
      isActive: boolean;
    }
  >({
    mutationKey: ["update-student"],
    mutationFn: ({
      id,
      name,
      email,
      cpf,
      address,
      course,
      institutionId,
      isActive,
    }) =>
      studentsManagerInstance.updateStudent(
        id,
        name,
        email,
        cpf,
        address,
        course,
        institutionId,
        isActive
      ),
  });

  return {
    isPending,
    error,
    mutateAsync,
    mutate,
  };
};
