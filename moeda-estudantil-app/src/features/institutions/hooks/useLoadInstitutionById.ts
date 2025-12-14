import { useQuery } from "@tanstack/react-query";
import institutionsManagerInstance from "../services";

export const useLoadInstitutionById = (id: string) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["institutions", id],
    queryFn: () => institutionsManagerInstance.getInstitutionById(id),
  });

  return { isLoading, data, error, refetch };
};
