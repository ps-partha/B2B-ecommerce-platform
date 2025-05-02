import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, ChevronRight, Receipt, ArrowDown, ArrowUp } from "lucide-react";

interface Payment {
  id: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  customer: string;
  email?: string;
  method: 'credit_card' | 'paypal' | 'bank_transfer';
  transactionId?: string;
}

interface PaymentListProps {
  isDetailed?: boolean;
}

const PaymentList: React.FC<PaymentListProps> = ({ isDetailed = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const payments: Payment[] = [
    { id: '001', date: '2023-01-14', status: 'completed', amount: 125.99, customer: 'John Smith', email: 'john@example.com', method: 'credit_card', transactionId: 'txn_1MbHfJ2eZvKYlo2C9u8JW1A' },
    { id: '002', date: '2023-01-13', status: 'completed', amount: 89.99, customer: 'Emily Johnson', email: 'emily@example.com', method: 'paypal', transactionId: 'txn_1MbHfJ2eZvKYlo2C9u8JW1B' },
    { id: '003', date: '2023-01-12', status: 'pending', amount: 250.00, customer: 'Michael Brown', email: 'michael@example.com', method: 'bank_transfer', transactionId: 'txn_1MbHfJ2eZvKYlo2C9u8JW1C' },
    { id: '004', date: '2023-01-11', status: 'completed', amount: 49.99, customer: 'Jessica Davis', email: 'jessica@example.com', method: 'credit_card', transactionId: 'txn_1MbHfJ2eZvKYlo2C9u8JW1D' },
    { id: '005', date: '2023-01-10', status: 'failed', amount: 79.99, customer: 'David Wilson', email: 'david@example.com', method: 'credit_card', transactionId: 'txn_1MbHfJ2eZvKYlo2C9u8JW1E' },
    { id: '006', date: '2023-01-09', status: 'completed', amount: 199.99, customer: 'Sarah Martinez', email: 'sarah@example.com', method: 'paypal', transactionId: 'txn_1MbHfJ2eZvKYlo2C9u8JW1F' },
    { id: '007', date: '2023-01-08', status: 'completed', amount: 149.99, customer: 'Robert Taylor', email: 'robert@example.com', method: 'bank_transfer', transactionId: 'txn_1MbHfJ2eZvKYlo2C9u8JW1G' },
    { id: '008', date: '2023-01-07', status: 'pending', amount: 65.00, customer: 'Jennifer Anderson', email: 'jennifer@example.com', method: 'credit_card', transactionId: 'txn_1MbHfJ2eZvKYlo2C9u8JW1H' },
  ];

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200">Failed</Badge>;
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'paypal':
        return <Wallet className="h-4 w-4" />;
      case 'bank_transfer':
        return <Receipt className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const currentItems = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <Card className="border rounded-lg shadow-sm overflow-hidden">
        <div className={`bg-white dark:bg-gray-950 ${!isDetailed ? "pt-4" : ""}`}>
          {!isDetailed && (
            <div className="px-6 flex justify-between items-center mb-4">
              <h3 className="font-semibold">Recent Transactions</h3>
              <Button variant="ghost" size="sm" className="text-sm" asChild>
                <a href="#">View All <ChevronRight className="h-4 w-4 ml-1" /></a>
              </Button>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  {isDetailed && <TableHead>Email</TableHead>}
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  {isDetailed && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    {isDetailed && <TableCell>{payment.email}</TableCell>}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.method)}
                        <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    {isDetailed && (
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {isDetailed && (
            <div className="py-4 px-6 flex items-center justify-between border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, payments.length)} of {payments.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white dark:bg-gray-950 rounded-lg border shadow-sm ${className}`} {...props} />
  );
}

export default PaymentList;