import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { category_name } = await req.json();

  console.log("Received category:", category_name); // Log the received category name

  // Check if the category already exists
  const { data, error } = await supabase
    .from("categories")
    .select("category_name")
    .eq("category_name", category_name)
    .single();

  if (data) {
    return new Response(JSON.stringify({ error: "Category already exists" }), {
      status: 400,
    });
  }

  // Insert category if it doesn't exist
  const { error: insertError } = await supabase
    .from("categories")
    .insert([{ category_name }]);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Category added successfully" }),
    {
      status: 200,
    }
  );
}
