import { useQuery } from "@tanstack/react-query";
import { rewardsManagerInstance } from "../services";

export const useLoadInstitutionStudents = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["institution-students"],
    queryFn: () => rewardsManagerInstance.getInstitutionStudents(),
  });

  return { data, isLoading, error, refetch };
};

