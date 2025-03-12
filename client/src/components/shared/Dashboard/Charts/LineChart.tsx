"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Updated Donation Data for the Full Year
const donationData = [
  { month: "Jan", online: 1200 },
  { month: "Feb", online: 1500 },
  { month: "Mar", online: 1800 },
  { month: "Apr", online: 1400 },
  { month: "May", online: 2000 },
  { month: "Jun", online: 1700 },
  { month: "Jul", online: 2200 },
  { month: "Aug", online: 2100 },
  { month: "Sep", online: 1900 },
  { month: "Oct", online: 2500 },
  { month: "Nov", online: 2300 },
  { month: "Dec", online: 2600 },
]

// Chart configuration
const chartConfig = {
  online: {
    label: "Online Donations",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function CharityChart() {
  return (
    <Card className="w-full max-w-96">
      <CardHeader>
        <CardTitle>Online Donations (2025)</CardTitle>
        <CardDescription>January - December</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={donationData}
            margin={{
              top: 20,
              left: -20,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {/* Online Donations Line */}
            <Line
              dataKey="online"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-1)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
