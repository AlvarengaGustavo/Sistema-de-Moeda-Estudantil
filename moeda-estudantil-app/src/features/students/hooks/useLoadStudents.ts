import { useQuery } from "@tanstack/react-query";
import studentsManagerInstance from "../services";

export const useLoadStudents = (
  page?: number,
  limit?: number,
  name?: string
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["students", page, limit, name],
    queryFn: () => studentsManagerInstance.getStudents(page, limit, name),
  });

  return { isLoading, data, error, refetch };
};
