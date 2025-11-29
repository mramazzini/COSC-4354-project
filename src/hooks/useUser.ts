import { useLogoutMutation } from "@/lib/services/authApi";
import { useGetMeQuery } from "@/lib/services/userApi";

export const useUser = () => {
  const { data: user, isLoading } = useGetMeQuery();
  const [logoutMutation, { isLoading: loggingOut }] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation().unwrap();

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return {
    user,
    loading: isLoading || loggingOut,
    isAuthenticated: !!user,
    logout,
  };
};
