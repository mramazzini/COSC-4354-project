import { useUser } from "@/hooks/useUser";
import { redirect } from "next/navigation";
import { Loading } from "../UI/Loading";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isAuthenticated, loading } = useUser();
  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return children;
}
