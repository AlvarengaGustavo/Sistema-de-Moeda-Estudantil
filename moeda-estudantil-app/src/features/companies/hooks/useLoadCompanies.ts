import { useQuery } from "@tanstack/react-query";
import companiesManagerInstance from "../services";

export const useLoadCompanies = (
  page?: number,
  limit?: number,
  name?: string
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["companies", page, limit, name],
    queryFn: () => companiesManagerInstance.getCompanies(page, limit, name),
  });

  return { isLoading, data, error, refetch };
};
