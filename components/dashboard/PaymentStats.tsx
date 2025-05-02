import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown, CreditCard } from "lucide-react";

const PaymentStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-1 w-4/5 bg-teal-500 rounded-full" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$12,234.50</div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Available for withdrawal in</span>
            <span className="font-medium">5 days</span>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse-subtle" />
            <span className="text-xs text-muted-foreground">Processing</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
          <ArrowUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$2,350.45</div>
          <div className="flex items-center text-xs">
            <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
            <span className="text-emerald-500 font-medium">+12.5%</span>
            <span className="text-muted-foreground ml-1">from yesterday</span>
          </div>
          <div className="mt-4 flex items-center space-x-1">
            <div className="h-2 w-2/12 bg-slate-200 rounded-sm" />
            <div className="h-2 w-3/12 bg-slate-300 rounded-sm" />
            <div className="h-2 w-4/12 bg-slate-400 rounded-sm" />
            <div className="h-2 w-6/12 bg-teal-500 rounded-sm" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Refunds</CardTitle>
          <ArrowDown className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$428.20</div>
          <div className="flex items-center text-xs">
            <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />
            <span className="text-rose-500 font-medium">-4.5%</span>
            <span className="text-muted-foreground ml-1">from last week</span>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1">
            {[30, 25, 15, 45, 20, 35, 10].map((value, idx) => (
              <div key={idx} className="h-8 bg-muted rounded-sm relative overflow-hidden">
                <div 
                  className="absolute bottom-0 w-full bg-rose-500" 
                  style={{ height: `${value}%` }}
                ></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStats;