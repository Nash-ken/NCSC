"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User } from "@/lib/dal";
import { CharityChart } from "@/components/shared/Dashboard/Charts/LineChart";

export const Overview = ({ user }: { user: User }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Hey <span className="capitalize">{user.username}</span>!
        </CardTitle>
        <CardDescription className="text-md">
          Let's look at our progress and your contribution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 gap-6 w-full flex flex-col md:flex-row">
        <CharityChart />
        sdfsfd
      </CardContent>
    </Card>
  );
};
