import { ContentTab } from "@/components/shared/Dashboard/Tabs/ContentTab";
import { fetchLogs } from "@/lib/actions";
import { getUser, fetchFiles } from "@/lib/dal";
import { redirect } from "next/navigation";



// Dashboard with Skeleton (using Suspense)
const Dashboard = async () => {
  const [user, files, logs] = await Promise.all([getUser(), fetchFiles(), fetchLogs()]);

  

  // If no user is found, redirect to login page
  if (!user) {
    redirect('/login');
  }

  const dashboardData = {
    user: user,
    files: files,
    logs: logs,
  }

  return (
    <div className="p-6 flex flex-col">
        <ContentTab {...dashboardData} />
    </div>
  );
};

export default Dashboard;
