"use client";
import { useEffect } from "react";
import { Loading } from "@/components/UI/Loading";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "@/lib/services/eventApi";

const NotificationPage = () => {
  const { data, isLoading } = useGetNotificationsQuery();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {data && data.length === 0 && (
        <p className="text-center">No notifications found.</p>
      )}
      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((notification) => (
            <li
              key={notification.id}
              className="border border-gray-300 rounded p-3"
            >
              <p>{notification.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
