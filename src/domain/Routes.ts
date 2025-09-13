export class Routes {
  static login = "/login";
  static signup = "/signup";

  //Dashboard routes
  static dashboard = {
    root: "/dashboard",
    events: "/dashboard/events",
    history: "/dashboard/history",
    profile: "/dashboard/profile",
    notifications: "/dashboard/notifications",
  };

  static dashboardTabs = ["events", "history", "profile", "notifications"];

  static buildDashboardUrl = (
    tab: (typeof Routes.dashboardTabs)[number] = "events"
  ) => `/dashboard/${tab}`;
}
