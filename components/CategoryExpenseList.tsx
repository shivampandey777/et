import { useState, useEffect } from "react";

interface Expense {
    id: number;
    category: string;
    amount: number;
    notes?: string;
    date?: string;
}

interface Props {
    category: string;
    onClose: () => void;
}

export function CategoryExpenseList({ category, onClose }: Props) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchExpenses = async () => {
        setLoading(true);
        const res = await fetch(`/api/expense/fetch?category=${encodeURIComponent(category)}`);
        const data = await res.json();
        setExpenses(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchExpenses();
    }, [category]);

    // Convert ID to string (if necessary) before sending it to the backend:
    const handleDelete = async (id: number) => {
        console.log("Deleting expense with ID:", id);  // Log the ID to ensure it's correct

        const res = await fetch("/api/expense/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id }), // Ensure you send the ID as a number
        });

        const data = await res.json();
        if (res.ok) {
            setExpenses((prev) => prev.filter((e) => e.id !== id));
        } else {
            console.error("Error deleting expense:", data.error);
        }
    };




    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Expenses for {category}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : expenses.length === 0 ? (
                    <div>No expenses found for this category.</div>
                ) : (
                    <ul className="space-y-2">
                        {expenses.map((expense) => (
                            <li key={expense.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                                    {expense.notes && <span className="ml-2 text-gray-500">{expense.notes}</span>}
                                    {expense.date && <span className="ml-2 text-xs text-gray-400">{expense.date}</span>}
                                </div>
                                <button
                                    onClick={() => handleDelete(expense.id)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}