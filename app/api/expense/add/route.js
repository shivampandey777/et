import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    // Parse the incoming JSON data
    const { category, amount, date } = await req.json();

        // Validate the data
    if (!category || !amount || !date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Insert the expense into the database
    const { error } = await supabase
      .from("expenses")
      .insert([{ category, amount, date }]);

    // Log any errors from Supabase
    if (error) {
      console.error("Error inserting into expense table:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    // Return a success message if everything is good
    return new Response(
      JSON.stringify({ message: "Expense added successfully" }),
      { status: 200 }
    );
  } catch (err) {
    // Catch any unexpected errors
    console.error("Error handling the request:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
