import { useQuery } from "@tanstack/react-query";
import teachersManagerInstance from "../services";

export const useLoadTeacherById = (id: string) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["teachers", id],
    queryFn: () => teachersManagerInstance.getTeacherById(id),
  });

  return { isLoading, data, error, refetch };
};
