import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, ArrowDown, ArrowUp, Receipt, WalletCards } from "lucide-react";

const PaymentActions = () => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Button variant="outline" className="justify-start h-auto py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-teal-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Payment Settings</div>
            <div className="text-xs text-muted-foreground">Update payment methods</div>
          </div>
        </div>
      </Button>

      <Button variant="outline" className="justify-start h-auto py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <Wallet className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Withdraw Funds</div>
            <div className="text-xs text-muted-foreground">$12,234.50 available</div>
          </div>
        </div>
      </Button>

      <Button variant="outline" className="justify-start h-auto py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
            <Receipt className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Invoice History</div>
            <div className="text-xs text-muted-foreground">View and download invoices</div>
          </div>
        </div>
      </Button>

      <Button variant="outline" className="justify-start h-auto py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
            <WalletCards className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Tax Documents</div>
            <div className="text-xs text-muted-foreground">Manage tax information</div>
          </div>
        </div>
      </Button>
    </div>
  );
};

export default PaymentActions;