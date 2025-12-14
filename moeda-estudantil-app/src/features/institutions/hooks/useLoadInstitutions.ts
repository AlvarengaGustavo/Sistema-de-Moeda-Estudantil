import { useQuery } from "@tanstack/react-query";
import institutionsManagerInstance from "../services";

export const useLoadInstitutions = (
  page?: number,
  limit?: number,
  name?: string
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["institutions", page, limit, name],
    queryFn: () =>
      institutionsManagerInstance.getInstitutions(page, limit, name),
  });

  return { isLoading, data, error, refetch };
};
