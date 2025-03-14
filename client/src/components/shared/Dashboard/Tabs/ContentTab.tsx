"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogEntry, MediaFile, User } from "@/lib/dal";
import { Overview } from "@/components/shared/Dashboard/Tabs/Overview/Overview";
import { Files } from "@/components/shared/Dashboard/Tabs/Files/Files";

// Utility function for conditional class names (for better readability)
import clsx from 'clsx';
import { LogsDataTable } from "../../Tables/LogTable";

interface ContentTabProps {
  user: User;
  files: MediaFile[];
  logs: LogEntry[];
}

export const ContentTab = ({ user, files, logs }: ContentTabProps) => {
  const isStaff = user.role.type === "staff";
  const isAdmin = user.role.type === "admin"; // Check if the user is an admin
  
  // Dynamic grid columns based on the role type
  const tabsGridClasses = clsx("grid gap-1", {
    "grid-cols-1": !(isStaff || isAdmin),  // Default: 1 column for non-staff/non-admin
    "grid-cols-2": isStaff,               // Staff: 2 columns
    "grid-cols-3": isAdmin,               // Admin: 3 columns (to fit all 3 tabs)
  });

  return (
    <Tabs defaultValue="overview" className="w-full">
      {/* Tabs List: Dynamically set grid columns */}
      <TabsList className={tabsGridClasses}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        {isStaff || isAdmin ? <TabsTrigger value="files">Files</TabsTrigger> : null} {/* Show Files tab for Staff and Admin */}
        {isAdmin && <TabsTrigger value="logs">Logs</TabsTrigger>} {/* Admin Tab for Logs */}
      </TabsList>
      
      {/* Tabs Content */}
      <TabsContent value="overview">
        <Overview user={user} />
      </TabsContent>
      
      {/* Conditionally render Files tab for staff and admin */}
      {(isStaff || isAdmin) && (
        <TabsContent value="files">
          <Files files={files} />
        </TabsContent>
      )}

      {/* Conditionally render Logs tab for admin */}
      {isAdmin && (
        <TabsContent value="logs">
          <LogsDataTable logs={logs} /> {/* Render the Logs Data Table */}
        </TabsContent>
      )}
    </Tabs>
  );
};
