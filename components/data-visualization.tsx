"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface DataVisualizationProps {
  predictions: any
}

export function DataVisualization({ predictions }: DataVisualizationProps) {
  // Historical data based on the uploaded image
  const historicalData = [
    { year: 2020, allocation: 384249300, committed: 378226271, spent: 334783061 },
    { year: 2021, allocation: 425000000, committed: 421447443, spent: 419826349 },
    { year: 2022, allocation: 450000000, committed: 434344498, spent: 434047435 },
  ]

  // Combine historical data with predictions
  const combinedData = predictions
    ? [
        ...historicalData,
        {
          year: predictions.nextYear,
          allocation: predictions.allocation,
          committed: predictions.committed,
          spent: predictions.spent,
          isPrediction: true,
        },
      ]
    : historicalData

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(value)
  }

  const chartConfig = {
    allocation: {
      label: "Allocation",
      color: "hsl(var(--chart-1))",
    },
    committed: {
      label: "Committed",
      color: "hsl(var(--chart-2))",
    },
    spent: {
      label: "Spent",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Main Visualization Heading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Data Visualization</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Interactive charts and graphs showing budget trends, comparisons, and predictive analysis for informed decision-making
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Trends Over Time</CardTitle>
            <CardDescription>Historical and predicted budget allocation, commitment, and spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px]">
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatCurrency} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Line
                  type="monotone"
                  dataKey="allocation"
                  stroke="var(--color-allocation)"
                  strokeWidth={2}
                  strokeDasharray={(data: any) => (data.isPrediction ? "5 5" : "0")}
                />
                <Line
                  type="monotone"
                  dataKey="committed"
                  stroke="var(--color-committed)"
                  strokeWidth={2}
                  strokeDasharray={(data: any) => (data.isPrediction ? "5 5" : "0")}
                />
                <Line
                  type="monotone"
                  dataKey="spent"
                  stroke="var(--color-spent)"
                  strokeWidth={2}
                  strokeDasharray={(data: any) => (data.isPrediction ? "5 5" : "0")}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Comparison</CardTitle>
            <CardDescription>Year-over-year comparison of budget categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px]">
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatCurrency} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Bar dataKey="allocation" fill="var(--color-allocation)" />
                <Bar dataKey="committed" fill="var(--color-committed)" />
                <Bar dataKey="spent" fill="var(--color-spent)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {predictions && (
        <Card>
          <CardHeader>
            <CardTitle>Prediction Analysis</CardTitle>
            <CardDescription>Detailed breakdown of predicted vs historical performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">Allocation Growth</div>
                <div className="text-2xl font-bold">
                  {(
                    ((predictions.allocation - historicalData[historicalData.length - 1].allocation) /
                      historicalData[historicalData.length - 1].allocation) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-gray-600">vs Previous Year</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">Utilization Rate</div>
                <div className="text-2xl font-bold">
                  {((predictions.spent / predictions.allocation) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Predicted Efficiency</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-lg font-semibold text-orange-600">Commitment Rate</div>
                <div className="text-2xl font-bold">
                  {((predictions.committed / predictions.allocation) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Budget Commitment</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
