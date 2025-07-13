"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { Textarea } from "./ui/textarea"
import { useTransactions } from "@/contexts/transaction-context"

export function ExpenseForm() {
    const { addTransaction, addCategory } = useTransactions()
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState<Date>(new Date())
    const [notes, setNotes] = useState("")
    const [categories, setCategories] = useState<string[]>([])  // Store categories
    const [newCategory, setNewCategory] = useState("")

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/category/fetch")
                const data = await response.json()

                if (response.ok) {
                    setCategories(data.map((category: { category_name: string }) => category.category_name))
                } else {
                    console.error("Error fetching categories:", data.error)
                }
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }

        fetchCategories()
    }, [])

    // Handle form submission to add expense
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !category) return;

        const transactionData = {
            amount: Number.parseFloat(amount),
            category,
            date,
            notes,
        };

        try {
            const response = await fetch(`/api/expense/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transactionData),
            });

            const data = await response.json();

            if (response.ok) {
                addTransaction({
                    id: Date.now().toString(),
                    ...transactionData,
                });

                setAmount("");
                setCategory("");
                setNotes("");
            } else {
                console.error("Error adding transaction:", data.error, data); // Log the entire response
            }
        } catch (error) {
            console.error("Error adding transaction:", error); // Log the error
        }
    };


    // Handle adding a new category to the database
    const handleAddCategory = async () => {
        if (newCategory && !categories.includes(newCategory)) {
            try {
                const response = await fetch("/api/category/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ category_name: newCategory }),
                })

                const data = await response.json()

                if (response.ok) {
                    setCategories((prevCategories) => [...prevCategories, newCategory])
                    setCategory(newCategory)
                    setNewCategory("")
                } else {
                    console.error("Error adding category:", data.error)
                }
            } catch (error) {
                console.error("Error adding category:", error)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {/* Amount */}
            <div className="space-y-1">
                <Label htmlFor="amount" className="text-xs">Amount</Label>
                <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-md">₹</span>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="12.99"
                        className="pl-6 border-gray-200 focus:border-gray-400 h-8 text-sm"
                    />
                </div>
            </div>

            {/* Category */}
            <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-gray-200 focus:border-gray-400 h-8 text-sm">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                        ))}
                        <SelectItem value="add-new" className="text-gray-600 text-sm">
                            <div className="flex items-center">
                                <Plus className="h-3 w-3 mr-1" />
                                Add category
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                {category === "add-new" && (
                    <div className="mt-2">
                        <Input
                            type="text"
                            placeholder="New category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="border-gray-200 focus:border-gray-400 h-8 text-sm"
                        />
                        <Button
                            type="button"
                            className="mt-2 w-full bg-gray-800 text-white font-medium py-1.5 text-sm rounded-md"
                            onClick={handleAddCategory}
                        >
                            Add Category
                        </Button>
                    </div>
                )}
            </div>

            {/* Date */}
            <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Button variant="outline" className="w-full justify-start text-left font-normal border-gray-200 focus:border-gray-400 h-8 text-sm">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(date, "dd/MM/yyyy")}
                </Button>
            </div>

            {/* Notes */}
            <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs">Notes (Optional)</Label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional details..."
                    className="border-gray-200 focus:border-gray-400 text-sm resize-none"
                    rows={2}
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-1.5 text-sm rounded-md h-8"
            >
                Save
            </Button>
        </form>
    )
}


