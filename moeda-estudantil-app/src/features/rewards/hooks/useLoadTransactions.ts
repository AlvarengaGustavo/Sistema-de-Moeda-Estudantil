import { useQuery } from "@tanstack/react-query";
import { rewardsManagerInstance } from "../services";

export const useLoadTransactions = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reward-transactions"],
    queryFn: () => rewardsManagerInstance.getTransactions(),
  });

  return { data, isLoading, error, refetch };
};

