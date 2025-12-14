import { useQuery } from "@tanstack/react-query";
import loginManagerInstance from "../services";
import { MUTATION_QUERY_KEYS } from "../utils/constants";

export const useLoadUserInfo = () => {
  const { refetch, isLoading, data, error } = useQuery({
    enabled: false,
    queryKey: MUTATION_QUERY_KEYS.loadUserInfo,
    queryFn: async () => loginManagerInstance.getAuthenticatedUserInfo(),
  });

  return { refetch, isLoading, userInfo: data, error };
};
