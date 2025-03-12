import { ContentTab } from "@/components/shared/Dashboard/Tabs/ContentTab";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser, fetchFiles } from "@/lib/dal";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Skeleton fallback for server-side data fetching
const DashboardSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Skeleton Loader for User Content */}
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-40" />

      {/* Skeleton Loader for Tabs */}
      <Skeleton className="w-32 h-8" />
      <Skeleton className="w-32 h-8" />

      {/* Skeleton for Files Tab */}
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-40" />
    </div>
  );
};

// Dashboard with Skeleton (using Suspense)
const Dashboard = async () => {
  const [user, files] = await Promise.all([getUser(), fetchFiles()]);

  // If no user is found, redirect to login page
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="p-6 flex flex-col">
      {/* Content is displayed once data is ready */}
      <Suspense fallback={<DashboardSkeleton />}>
        <ContentTab user={user} files={files} />
      </Suspense>
    </div>
  );
};

export default Dashboard;
