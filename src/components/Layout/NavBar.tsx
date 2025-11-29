"use client";

import { Routes } from "@/domain/Routes";
import { NAVBAR_HEIGHT_TAILWIND } from "@/lib/globals";
import { useGetNotificationsQuery } from "@/lib/services/eventApi";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

const Navbar = () => {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const { user, logout, loading: userLoading } = useUser();

  const unreadCount = notifications.reduce(
    (count, n) => (n.read ? count : count + 1),
    0
  );

  const isAuthenticated = !!user && !userLoading;

  return (
    <nav
      className={`navbar bg-neutral text-neutral-content font-bold ${NAVBAR_HEIGHT_TAILWIND} fixed top-0 left-0 z-[1]`}
    >
      <div className="navbar-start" />

      <div className="navbar-center">
        <Link href={Routes.home} className="btn btn-ghost text-2xl">
          Volunteer Hub
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-2">
        {isAuthenticated && (
          <Link
            href={Routes.dashboard.notifications}
            className="btn btn-ghost btn-circle"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {!isLoading && unreadCount > 0 && (
                <span className="badge badge-xs badge-primary indicator-item">
                  {unreadCount}
                </span>
              )}
            </div>
          </Link>
        )}

        <ul className="menu menu-horizontal px-1">
          {!isAuthenticated && (
            <>
              <li>
                <Link href={Routes.login}>Login</Link>
              </li>
              <li>
                <Link href={Routes.signup}>Signup</Link>
              </li>
            </>
          )}

          {isAuthenticated && (
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
