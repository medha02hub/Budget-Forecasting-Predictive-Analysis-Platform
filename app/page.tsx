"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlanningInputForm } from "@/components/planning-input-form"
import { PredictionResults } from "@/components/prediction-results"
import { DataVisualization } from "@/components/data-visualization"
import { HistoricalData } from "@/components/historical-data"
import { BarChart3, TrendingUp, FileText, Database } from "lucide-react"

export default function Home() {
  const [predictions, setPredictions] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePredictionComplete = (predictionData: any) => {
    setPredictions(predictionData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Budget Forecasting and Predictive Analysis</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze historical financial data and predict future budget allocations for your organization's grant
            applications
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Planning Inputs for Next Year</CardTitle>
            <CardDescription>
              Enter your organization's planning parameters to generate accurate budget predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlanningInputForm onPredictionComplete={handlePredictionComplete} setIsLoading={setIsLoading} />
          </CardContent>
        </Card>

        {isLoading && (
          <PredictionResults predictions={predictions} isLoading={isLoading} />
        )}
        {!isLoading && predictions && (
          <>
            <PredictionResults predictions={predictions} isLoading={isLoading} />
            <div className="mt-8">
              <DataVisualization predictions={predictions} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
