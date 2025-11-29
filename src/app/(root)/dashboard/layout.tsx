"use client";
import { AdminGuard } from "@/components/Auth/AdminGuard";
import { AuthGuard } from "@/components/Auth/AuthGuard";
import { Loading } from "@/components/UI/Loading";
import { Routes } from "@/domain/Routes";
import { useGetMeQuery } from "@/lib/services/userApi";
import { useAppDispatch } from "@/lib/store";
import { setUser } from "@/lib/store/userSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Tab = (typeof Routes.dashboardTabs)[number];
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetMeQuery();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const tab = pathname.split("/").pop() as Tab;

  const initialized = true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tab = e.target.value as Tab;
    router.push(Routes.buildDashboardUrl(tab));
  };

  useEffect(() => {
    if (isLoading || !data) return;
    console.log(data);
    dispatch(setUser(data));
  }, [data, isLoading, dispatch]);

  if (!initialized) return <Loading />;
  const protectedRoutes = ["event-management", "match", "report"];
  return (
    <AuthGuard>
      <div className="p-4">
        {initialized && (
          <div className="tabs tabs-box mb-4 border border-primary">
            {Routes.dashboardTabs.map((label, index) =>
              !protectedRoutes.includes(label) ? (
                <input
                  key={label}
                  type="radio"
                  name={"character-tab" + index}
                  className={`tab capitalize ${
                    tab === label ? "tab-active" : ""
                  }`}
                  aria-label={label}
                  checked={tab === label}
                  value={label}
                  onChange={handleChange}
                />
              ) : (
                <AdminGuard key={label}>
                  <input
                    type="radio"
                    name={"character-tab" + index}
                    className={`tab capitalize ${
                      tab === label ? "tab-active" : ""
                    }`}
                    aria-label={label}
                    checked={tab === label}
                    value={label}
                    onChange={handleChange}
                  />
                </AdminGuard>
              )
            )}
          </div>
        )}

        {initialized && (
          <div className="relative flex flex-col items-center w-full bg-base-100 p-3 card">
            {children}
          </div>
        )}
      </div>
    </AuthGuard>
  );
};
export default DashboardLayout;
