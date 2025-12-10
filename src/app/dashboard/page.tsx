// src/app/dashboard/page.tsx
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  // Server component wrapper – all interactive logic lives in DashboardClient
  return <DashboardClient />;
}
