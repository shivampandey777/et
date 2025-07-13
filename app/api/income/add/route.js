import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { category, amount, date } = await req.json();

  // Validate data
  if (!category || !amount || !date) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // Add income entry
  const { error } = await supabase
    .from("income")
    .insert([{ category, amount, date }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Income added successfully" }),
    {
      status: 200,
    }
  );
}
