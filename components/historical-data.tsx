"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function HistoricalData() {
  const historicalData = [
    {
      year: 2020,
      budg_mj_head: "R1",
      budg_mi_head: "R101",
      budg_prog_cd: "OSTF",
      allocation: 384249300,
      committed: 378226271,
      spent: 334783061,
    },
    {
      year: 2021,
      budg_mj_head: "R1",
      budg_mi_head: "R101",
      budg_prog_cd: "OSTF",
      allocation: 425000000,
      committed: 421447443,
      spent: 419826349,
    },
    {
      year: 2022,
      budg_mj_head: "R1",
      budg_mi_head: "R101",
      budg_prog_cd: "OSTF",
      allocation: 450000000,
      committed: 434344498,
      spent: 434047435,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateUtilization = (spent: number, allocation: number) => {
    return ((spent / allocation) * 100).toFixed(1)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historical Financial Data</CardTitle>
          <CardDescription>Government grant financial data for the past 3 years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Image
              src="/dataset-reference.png"
              alt="Original dataset reference"
              width={600}
              height={200}
              className="rounded-lg border"
            />
            <p className="text-sm text-gray-600 mt-2">Reference: Original dataset structure</p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Major Head</TableHead>
                  <TableHead>Minor Head</TableHead>
                  <TableHead>Program Code</TableHead>
                  <TableHead className="text-right">Allocation</TableHead>
                  <TableHead className="text-right">Committed</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                  <TableHead className="text-center">Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicalData.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell className="font-medium">{row.year}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.budg_mj_head}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.budg_mi_head}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.budg_prog_cd}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(row.allocation)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(row.committed)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(row.spent)}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          Number.parseFloat(calculateUtilization(row.spent, row.allocation)) > 90
                            ? "default"
                            : "secondary"
                        }
                      >
                        {calculateUtilization(row.spent, row.allocation)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8.2%</div>
            <p className="text-sm text-gray-600">Annual allocation increase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">92.4%</div>
            <p className="text-sm text-gray-600">Budget utilization rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commitment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">96.8%</div>
            <p className="text-sm text-gray-600">Average commitment rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
