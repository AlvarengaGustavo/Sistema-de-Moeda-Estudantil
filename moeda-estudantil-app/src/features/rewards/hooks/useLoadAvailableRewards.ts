import { useQuery } from "@tanstack/react-query";
import { rewardsManagerInstance } from "../services";

export const useLoadAvailableRewards = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["available-rewards"],
    queryFn: () => rewardsManagerInstance.getAvailableRewards(),
  });

  return { data, isLoading, error, refetch };
};

