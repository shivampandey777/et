import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useTransactions } from "@/contexts/transaction-context";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function IncomeForm() {
    const { addTransaction, addCategory } = useTransactions();
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState<Date | null>(new Date());
    const [notes, setNotes] = useState("");
    const [categories, setCategories] = useState<{ id: number; category_name: string }[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch categories from the backend when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true); // Start loading
            try {
                const response = await fetch("/api/income-category/fetch");
                const data = await response.json();

                if (response.ok) {
                    console.log(data); // Log the fetched data
                    setCategories(data.map((category: { id: number, category_name: string }) => category)); // Populate categories with id and category_name
                } else {
                    console.error("Error fetching categories:", data.error);
                    toast.error(data.error || "Failed to fetch categories.");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("An error occurred while fetching categories.");
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchCategories(); // Call function on mount
    }, []); // Empty dependency array ensures it runs once on mount

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!amount || !category || !date) {
            setErrorMessage("Please fill in all the required fields.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(""); // Reset error message
        setSuccessMessage(""); // Reset success message

        const transactionData = {
            amount: Number.parseFloat(amount),
            category,
            date,
            notes,
        };

        try {
            const response = await fetch(`/api/income/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transactionData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Transaction added successfully!");
                toast.success("Transaction added!", {
                    description: "Your income was saved.",
                });
                addTransaction({
                    id: Date.now().toString(),
                    ...transactionData,
                });

                setAmount("");
                setCategory("");
                setNotes("");
            } else {
                setErrorMessage(data.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Error adding transaction. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddCategory = async () => {
        if (newCategory && !categories.some((cat) => cat.category_name === newCategory)) {
            try {
                const response = await fetch("/api/income-category/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ category_name: newCategory }), // Send only category_name
                });
                const data = await response.json();

                if (response.ok) {
                    setCategories((prevCategories) => [
                        ...prevCategories,
                        { id: Date.now(), category_name: newCategory }, // Adding the new category to the list
                    ]);
                    toast.success("Category added!", {
                        description: `Category "${newCategory}" created.`,
                    });
                    setCategory(newCategory);
                    setNewCategory("");
                } else {
                    console.error("Error adding category:", data.error);
                }
            } catch (error) {
                console.error("Error adding category:", error);
            }
        }
    };

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
                    <SelectContent className="max-h-60 overflow-y-auto">
                        {loading ? (
                            <SelectItem value="loading" disabled className="text-gray-500 text-sm">
                                Loading...
                            </SelectItem>
                        ) : (
                            categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.category_name} className="text-sm">
                                    {cat.category_name}
                                </SelectItem>
                            ))
                        )}

                        {/* Add new category option */}
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
                <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="border-gray-200 focus:border-gray-400 h-8 text-sm w-full rounded-md px-3 py-1.5"
                />
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

            {/* Error and Success Messages */}
            {errorMessage && <div className="text-red-500 text-xs">{errorMessage}</div>}
            {successMessage && <div className="text-green-500 text-xs">{successMessage}</div>}

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-1.5 text-sm rounded-md h-8"
                disabled={isSubmitting} // Disable while submitting
            >
                {isSubmitting ? "Submitting..." : "Save"}
            </Button>
        </form>
    );
}
