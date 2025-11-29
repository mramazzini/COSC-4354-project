"use client";
import { useGetMeQuery } from "@/lib/services/userApi";
import { ReactNode } from "react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { data, isLoading } = useGetMeQuery();
  if (isLoading) {
    return <span className="italic text-sm">Checking permissions…</span>;
  }

  if (!data || data.role !== 0) {
    return null;
  }

  return <>{children}</>;
}
