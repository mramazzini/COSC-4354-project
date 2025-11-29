export class Routes {
  static home = "/";

  static login = "/login";
  static signup = "/signup";

  //Dashboard routes
  static dashboard = {
    root: "/dashboard",
    events: "/dashboard/events",
    history: "/dashboard/history",
    profile: "/dashboard/profile",
    notifications: "/dashboard/notifications",
    eventManagement: "/dashboard/event-management",
    match: "/dashboard/match",
    report: "/dashboard/report",
  };

  static dashboardTabs = [
    "events",
    "history",
    "profile",
    "notifications",
    "event-management",
    "match",
    "report",
  ];

  static buildDashboardUrl = (
    tab: (typeof Routes.dashboardTabs)[number] = "events"
  ) => `/dashboard/${tab}`;
}
