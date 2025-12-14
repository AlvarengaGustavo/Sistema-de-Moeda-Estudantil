import { useMutation } from "@tanstack/react-query";
import teachersManagerInstance from "../services";
import type { ICreateTeacher } from "../types/ITeacher";

export const useCreateTeacher = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation<
    unknown,
    unknown,
    ICreateTeacher
  >({
    mutationKey: ["create-teacher"],
    mutationFn: (payload) => teachersManagerInstance.createTeacher(payload),
  });

  return {
    isPending,
    error,
    mutateAsync,
    mutate,
  };
};
