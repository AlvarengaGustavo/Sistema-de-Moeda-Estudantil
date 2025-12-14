import { useMutation } from "@tanstack/react-query";
import { companyRewardsManagerInstance } from "../services";
import type { ICreateCompanyRewardPayload } from "../types/IReward";

export const useCreateCompanyReward = () => {
  const { isPending, error, mutateAsync, mutate } = useMutation<
    unknown,
    unknown,
    ICreateCompanyRewardPayload
  >({
    mutationKey: ["create-company-reward"],
    mutationFn: (payload) => companyRewardsManagerInstance.createReward(payload),
  });

  return { isPending, error, mutateAsync, mutate };
};

