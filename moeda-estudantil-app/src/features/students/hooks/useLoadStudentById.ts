import { useQuery } from "@tanstack/react-query";
import studentsManagerInstance from "../services";

export const useLoadStudentById = (id: string) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["students", id],
    queryFn: () => studentsManagerInstance.getStudentById(id),
  });

  return { isLoading, data, error, refetch };
};
