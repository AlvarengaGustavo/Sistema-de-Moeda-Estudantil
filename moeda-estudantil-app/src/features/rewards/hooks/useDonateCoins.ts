import { useMutation } from "@tanstack/react-query";
import { rewardsManagerInstance } from "../services";
import type { IDonateCoinsPayload } from "../types/IReward";

export const useDonateCoins = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation<
    unknown,
    unknown,
    IDonateCoinsPayload
  >({
    mutationKey: ["donate-coins"],
    mutationFn: (payload) => rewardsManagerInstance.donateCoins(payload),
  });

  return { isPending, error, mutateAsync, mutate };
};

