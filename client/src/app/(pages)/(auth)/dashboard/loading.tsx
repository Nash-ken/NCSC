import { Skeleton } from "@/components/ui/skeleton";

// skeleton.tsx
const DashboardSkeleton = () => {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-40" />
      </div>
    );
  };
  
  export default DashboardSkeleton;

