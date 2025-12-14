import { useMutation } from "@tanstack/react-query";
import { rewardsManagerInstance } from "../services";
import type { IRedeemRewardPayload } from "../types/IReward";

export const useRedeemReward = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation<
    unknown,
    unknown,
    IRedeemRewardPayload
  >({
    mutationKey: ["redeem-reward"],
    mutationFn: (payload) => rewardsManagerInstance.redeemReward(payload),
  });

  return { isPending, error, mutateAsync, mutate };
};

