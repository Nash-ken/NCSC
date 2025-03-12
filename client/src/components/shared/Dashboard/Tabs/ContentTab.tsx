"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MediaFile, User } from "@/lib/dal";
import { Overview } from "@/components/shared/Dashboard/Tabs/Overview";
import { Files } from "@/components/shared/Dashboard/Tabs/Files";

// Utility function for conditional class names (for better readability)
import clsx from 'clsx';

interface ContentTabProps {
  user: User;
  files: MediaFile[];
}

export const ContentTab = ({ user, files }: ContentTabProps) => {
  const isStaff = user.role.type === "staff";
  
  // Dynamic grid columns based on the role type
  const tabsGridClasses = clsx("grid gap-1", {
    "grid-cols-1": !isStaff,
    "grid-cols-2": isStaff,
  });

  return (
    <Tabs defaultValue="overview" className="w-full">
      {/* Tabs List: Dynamically set grid columns */}
      <TabsList className={tabsGridClasses}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        {isStaff && <TabsTrigger value="files">Files</TabsTrigger>}
      </TabsList>
      
      {/* Tabs Content */}
      <TabsContent value="overview">
        <Overview user={user} />
      </TabsContent>
      
      {/* Conditionally render Files tab for staff */}
      {isStaff && (
        <TabsContent value="files">
          <Files files={files} />
        </TabsContent>
      )}
    </Tabs>
  );
};
