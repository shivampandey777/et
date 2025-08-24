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

interface Category {
    id?: number;
    category_name: string;
}

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
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch categories from the backend when the component mounts
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

    useEffect(() => {
        fetchCategories(); // Call function on mount
    }, []); // Empty dependency array ensures it runs once on mount


    const handleDeleteCategory = async (categoryId: number) => {
        try {
            const response = await fetch("/api/category/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: Number(categoryId) }),
            });
            const data = await response.json();

            if (response.ok) {
                setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
                // Show success message when category is deleted successfully
                toast.success("Category deleted successfully!", {
                    description: `The category with ID ${categoryId} has been deleted.`,
                });
            } else {
                // Show error message if deletion fails
                toast.error(data.error || "Failed to delete category.");
            }
        } catch (error) {
            // Show error message in case of any exception
            toast.error("An error occurred while deleting category.");
        }
    };

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
            {/* Category */}
            <div className="relative">
                <button
                    type="button"
                    className="w-full h-8 text-sm rounded-md px-3 py-1.5 flex justify-between items-center border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    onClick={() => {
                        setIsDropdownOpen((open) => {
                            const next = !open;
                            if (next) fetchCategories();
                            return next;
                        });
                    }}
                >
                    {category || "Select"}
                    <span className="ml-2">&#9662;</span>
                </button>

                {isDropdownOpen && (
                    <div
                        className="
        absolute z-10 bg-white border rounded-md shadow-md w-full mt-1
        overflow-y-auto
        max-h-[150px]   /* ~ Add row (sticky) + 1 item visible */
      "
                    >
                        {/* Add new category (sticky header) */}
                        {isAddingCategory ? (
                            <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-2 bg-white border-b">
                                <Input
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="New category name"
                                    className="text-sm flex-1 h-8"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    className="h-8 bg-green-600 text-white px-2"
                                    onClick={async () => {
                                        await handleAddCategory();
                                        setIsAddingCategory(false);
                                        setNewCategory("");
                                    }}
                                    disabled={!newCategory.trim()}
                                >
                                    Add
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-gray-600"
                                    onClick={() => {
                                        setIsAddingCategory(false);
                                        setNewCategory("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="sticky top-0 z-10 w-full flex items-center px-3 py-2 bg-white border-b hover:bg-gray-50 text-left"
                                onClick={() => setIsAddingCategory(true)}
                            >
                                <Plus className="h-3 w-3 mr-2" />
                                Add category
                            </button>
                        )}

                        {/* Loading state */}
                        {loading && (
                            <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>
                        )}

                        {/* Category items */}
                        {!loading && categories.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">No categories</div>
                        )}

                        {!loading &&
                            categories.map((cat) => (
                                <div
                                    key={cat.id ?? cat.category_name}
                                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-100"
                                >
                                    <span
                                        className="flex-1 text-left cursor-pointer truncate"
                                        onClick={() => {
                                            setCategory(cat.category_name);
                                            setIsDropdownOpen(false);
                                        }}
                                        title={cat.category_name}
                                    >
                                        {cat.category_name}
                                    </span>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-xs text-red-600 hover:text-white border border-red-500 hover:bg-red-500 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCategory(cat.id!);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
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
