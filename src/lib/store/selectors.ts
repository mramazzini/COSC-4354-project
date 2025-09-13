import { useAppSelector } from ".";

export const useUser = () => {
  return useAppSelector((state) => state.user.data);
};
