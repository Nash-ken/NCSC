"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Updated chart data with amounts raised for charity (in dollars)
const chartData = [
  { month: "January", raised: 186 },
  { month: "February", raised: 305 },
  { month: "March", raised: 237 },
  { month: "April", raised: 73 },
  { month: "May", raised: 209 },
  { month: "June", raised: 214 },
]

// Calculate the total amount raised for charity
const totalRaised = chartData.reduce((acc, curr) => acc + curr.raised, 0)

const chartConfig = {
  raised: {
    label: "Amount Raised",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function LineChartComponent() {
  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Amount Raised for Charity</CardTitle>
        {/* Display total amount raised in the description */}
        <CardDescription>{`$${totalRaised.toLocaleString()}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Shorten the month name
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="raised"
              type="natural"
              stroke="white"
              strokeWidth={2}
              dot={{
                fill: "var(--color-foreground)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
