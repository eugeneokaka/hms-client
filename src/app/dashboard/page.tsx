"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Wallet,
} from "lucide-react";

// Types
interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  description: string;
  createdAt: string;
}

interface Finance {
  income: number;
  expenses: number;
  netProfit: number;
}

interface CategoryStats {
  category: string;
  _count: { id: number };
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [finance, setFinance] = useState<Finance>({
    income: 0,
    expenses: 0,
    netProfit: 0,
  });
  const [topCategories, setTopCategories] = useState<CategoryStats[]>([]);
  const [mostExpensive, setMostExpensive] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    type: "INCOME",
    amount: "",
    category: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const [transactionsRes, financeRes, categoriesRes, expensiveRes] =
        await Promise.all([
          fetch("http://localhost:4000/finance/transactions"),
          fetch("http://localhost:4000/finance/finance"),
          fetch("http://localhost:4000/finance/most-category"),
          fetch("http://localhost:4000/finance/most-expensive"),
        ]);

      const transactions = await transactionsRes.json();
      const finance = await financeRes.json();
      const categories = await categoriesRes.json();
      const expensive = await expensiveRes.json();

      setTransactions(transactions);
      setFinance(finance);
      setTopCategories(categories.category || []);
      setMostExpensive(expensive);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/finance/transaction ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (res.ok) {
        fetchData();
        setNewTransaction({
          type: "INCOME",
          amount: "",
          category: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Financial Dashboard</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">Add Transaction</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: e.target.value,
                      })
                    }
                    placeholder="Enter amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={newTransaction.category}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        category: e.target.value,
                      })
                    }
                    placeholder="Enter category"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter description"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Transaction
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${finance.income}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${finance.expenses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <PiggyBank className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${finance.netProfit}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Largest Transaction
              </CardTitle>
              <Wallet className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mostExpensive?.amount || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {mostExpensive?.category || "No transactions"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <span
                            className={`inline-flex items-center ${
                              transaction.type === "INCOME"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {transaction.type === "INCOME" ? (
                              <ArrowUpCircle className="mr-2 h-4 w-4" />
                            ) : (
                              <ArrowDownCircle className="mr-2 h-4 w-4" />
                            )}
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell>${transaction.amount}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {topCategories.map((category) => (
                  <div
                    key={category.category}
                    className="mb-4 grid grid-cols-2 items-center"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{category.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {category._count.id} transactions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${
                              (category._count.id /
                                Math.max(
                                  ...topCategories.map((c) => c._count.id)
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
