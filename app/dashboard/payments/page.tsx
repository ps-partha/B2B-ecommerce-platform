"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Wallet, ChevronDown, ChevronUp } from "lucide-react";
import { AreaChart } from "@tremor/react";
import PaymentList from '@/components/dashboard/PaymentList';
import PaymentActions from "@/components/dashboard/PaymentActions"
const PaymentDashboard = () => {
    const [timeRange, setTimeRange] = useState('30d');
    const [showDetails, setShowDetails] = useState(false);

    // Sample data for the chart
    const chartData = [
        { date: "2023-01-01", revenue: 2400 },
        { date: "2023-01-02", revenue: 1398 },
        { date: "2023-01-03", revenue: 3200 },
        { date: "2023-01-04", revenue: 2780 },
        { date: "2023-01-05", revenue: 1890 },
        { date: "2023-01-06", revenue: 2390 },
        { date: "2023-01-07", revenue: 3490 },
        { date: "2023-01-08", revenue: 2490 },
        { date: "2023-01-09", revenue: 2900 },
        { date: "2023-01-10", revenue: 3300 },
        { date: "2023-01-11", revenue: 3500 },
        { date: "2023-01-12", revenue: 3700 },
        { date: "2023-01-13", revenue: 3600 },
        { date: "2023-01-14", revenue: 3800 },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                    <CardTitle>Payments</CardTitle>
                    <p className="text-muted-foreground mt-1">Manage your payments and transactions</p>
                </div>

                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Last 30 Days
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="sm">
                        <Wallet className="h-4 w-4 mr-2" />
                        Withdraw Funds
                    </Button>
                </div>
            </div>
            <Tabs defaultValue="overview" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="transactions">Transactions</TabsTrigger>
                        <TabsTrigger value="payouts">Payouts</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center space-x-2">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[150px] h-9">
                                <SelectValue placeholder="All Transactions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Transactions</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-lg">Revenue Overview</CardTitle>
                                    <CardDescription>Daily revenue for the selected period</CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => setTimeRange('7d')}>
                                        7D
                                    </Button>
                                    <Button variant={timeRange === '30d' ? "default" : "outline"} size="sm" onClick={() => setTimeRange('30d')}>
                                        30D
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setTimeRange('90d')}>
                                        90D
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] py-4">
                                    <AreaChart
                                        data={chartData}
                                        index="date"
                                        categories={["revenue"]}
                                        colors={["rose"]}
                                        className="h-full"
                                        showLegend={false}
                                        showXAxis={true}
                                        showYAxis={true}
                                        yAxisWidth={65}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                                <CardDescription>Manage your payment operations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <PaymentActions />
                            </CardContent>
                        </Card>
                    </div>

                    <PaymentList />
                </TabsContent>

                <TabsContent value="transactions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>View and manage all your transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-4">
                                <div className="relative w-full max-w-sm">
                                    <Input
                                        placeholder="Search transactions..."
                                        className="pl-10"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        Export CSV
                                    </Button>
                                </div>
                            </div>
                            <PaymentList isDetailed={true} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payouts">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payout History</CardTitle>
                            <CardDescription>View and manage all your payouts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground py-8">
                                No payouts to display yet. Payouts are processed automatically every 30 days.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Settings</CardTitle>
                            <CardDescription>Configure your payment preferences and accounts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="paypal">PayPal Email</Label>
                                    <Input id="paypal" placeholder="your-email@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bank">Bank Account</Label>
                                    <Input id="bank" placeholder="XXXX XXXX XXXX 4242" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="threshold">Minimum Payout Threshold ($)</Label>
                                    <Input id="threshold" type="number" placeholder="50" />
                                </div>
                                <Button>Save Settings</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-8">
                <button
                    className="flex items-center text-sm text-muted-foreground"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                    {showDetails ? "Hide payment details" : "Show payment details"}
                </button>

                {showDetails && (
                    <div className="mt-4 bg-muted/30 p-4 rounded-md text-sm space-y-2">
                        <p><strong>Payment Processing:</strong> Payments are typically processed within 24 hours.</p>
                        <p><strong>Fees:</strong> A 2.9% + $0.30 fee is applied to each transaction.</p>
                        <p><strong>Payouts:</strong> Payouts are automatically processed every 30 days, provided your balance exceeds the minimum threshold.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentDashboard;