import { useMutation } from "@tanstack/react-query";
import type { ICreateStudent } from "../../students/types/IStudent";
import registerManagerInstance from "../services";

export const useCreateStudent = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["create-student"],
    mutationFn: async (data: ICreateStudent) => {
      await registerManagerInstance.createStudent(
        data.email,
        data.password,
        data.name,
        data.cpf,
        data.address,
        data.course,
        data.institutionId
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
