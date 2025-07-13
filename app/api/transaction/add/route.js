import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { amount, category, date, notes, type } = await req.json();

  const { error } = await supabase
    .from(type === "income" ? "income" : "expense")
    .insert([{ amount, category, date, notes }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Transaction added successfully" }),
    { status: 200 }
  );
}
