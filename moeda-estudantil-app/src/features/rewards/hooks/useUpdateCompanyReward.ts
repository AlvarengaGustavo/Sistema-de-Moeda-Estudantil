import { useMutation } from "@tanstack/react-query";
import { companyRewardsManagerInstance } from "../services";
import type { IUpdateCompanyRewardPayload } from "../types/IReward";

export const useUpdateCompanyReward = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation<
    unknown,
    unknown,
    IUpdateCompanyRewardPayload
  >({
    mutationKey: ["update-company-reward"],
    mutationFn: (payload) => companyRewardsManagerInstance.updateReward(payload),
  });

  return { isPending, error, mutateAsync, mutate };
};

