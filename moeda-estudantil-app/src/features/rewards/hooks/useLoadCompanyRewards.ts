import { useQuery } from "@tanstack/react-query";
import { companyRewardsManagerInstance } from "../services";

export const useLoadCompanyRewards = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["company-rewards"],
    queryFn: () => companyRewardsManagerInstance.listRewards(),
  });

  return { data, isLoading, error, refetch };
};

