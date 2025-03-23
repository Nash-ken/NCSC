"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { startTransition } from "react";
import { toast } from "sonner";

// Define the Log type
export type Log = {
  id: string;
  type: string;
  user: string;
  source: string;
  state: string;
  activity: string;
  browser: string;
  createdAt: string;
};

// Log table columns
export const logColumns: ColumnDef<Log>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "activity",
    header: "Activity",
  },
  {
    accessorKey: "browser",
    header: "Browser",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date);
      return <span>{formatted}</span>;
    },
  },
];
