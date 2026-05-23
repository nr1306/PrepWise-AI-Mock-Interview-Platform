import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Brand strip */}
      <div className="fixed top-0 left-0 w-full h-16 flex items-center px-8 z-10">
        <a href="/" className="flex items-center gap-2 no-underline">
          <span className="material-symbols-outlined text-secondary text-2xl">waves</span>
          <span className="text-headline-md text-on-surface font-bold">PrepAI</span>
        </a>
      </div>

      <div className="w-full max-w-md mt-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
