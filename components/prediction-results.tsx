"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Download, TrendingUp, DollarSign, Target, CheckCircle } from "lucide-react"

interface PredictionResultsProps {
  predictions: any
  isLoading: boolean
}

export function PredictionResults({ predictions, isLoading }: PredictionResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleExportReport = () => {
    if (!predictions) return

    const reportData = {
      title: `Budget Prediction Report - ${predictions.nextYear}`,
      generatedOn: new Date().toLocaleDateString(),
      predictions: {
        allocation: formatCurrency(predictions.allocation),
        committed: formatCurrency(predictions.committed),
        spent: formatCurrency(predictions.spent),
      },
      confidence: `${(predictions.confidence * 100).toFixed(1)}%`,
      factors: predictions.factors,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `budget-prediction-${predictions.nextYear}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Generating Predictions...</p>
            <p className="text-sm text-gray-600">Training model with your inputs</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!predictions) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No Predictions Yet</p>
            <p className="text-sm text-gray-500">Complete the planning inputs to see predictions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Budget Predictions for {predictions.nextYear}</h2>
          <p className="text-gray-600">Based on historical data and planning inputs</p>
        </div>
        <Button onClick={handleExportReport} className="bg-green-600 hover:bg-green-700">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Allocation</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(predictions.allocation)}</div>
            <p className="text-xs text-muted-foreground">Total budget allocation expected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Committed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(predictions.committed)}</div>
            <p className="text-xs text-muted-foreground">Amount expected to be committed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Spent</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(predictions.spent)}</div>
            <p className="text-xs text-muted-foreground">Amount expected to be spent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Confidence</CardTitle>
          <CardDescription>Confidence level of the prediction based on historical data patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={predictions.confidence * 100} className="flex-1" />
            <Badge variant="secondary">{(predictions.confidence * 100).toFixed(1)}% Confident</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Planning Factors</CardTitle>
          <CardDescription>Input parameters used for generating these predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{predictions.factors.promotions || 0}</div>
              <div className="text-sm text-gray-600">Promotions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{predictions.factors.newJoinees || 0}</div>
              <div className="text-sm text-gray-600">New Joinees</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{predictions.factors.retirements || 0}</div>
              <div className="text-sm text-gray-600">Retirements</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{predictions.factors.incrementJanuary || 0}%</div>
              <div className="text-sm text-gray-600">Jan Increment</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {formatCurrency(predictions.factors.newJoineeBasicPay || 0)}
              </div>
              <div className="text-sm text-gray-600">New Joinee Pay</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{formatCurrency(predictions.factors.gratuity || 0)}</div>
              <div className="text-sm text-gray-600">Gratuity</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
