import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";
import AppShell from "@/components/layout/AppShell";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return <AppShell>{children}</AppShell>;
};

export default DashboardLayout;
