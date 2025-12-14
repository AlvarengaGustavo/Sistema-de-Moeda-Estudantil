import { useQuery } from "@tanstack/react-query";
import teachersManagerInstance from "../services";

export const useLoadTeachers = (
  page?: number,
  limit?: number,
  name?: string
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["teachers", page, limit, name],
    queryFn: () => teachersManagerInstance.getTeachers(page, limit, name),
  });

  return { isLoading, data, error, refetch };
};
