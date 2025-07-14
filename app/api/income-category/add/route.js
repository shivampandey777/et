import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { category_name } = await req.json(); // Get category_name from the request body

  // Validate input
  if (!category_name) {
    return new Response(
      JSON.stringify({ error: "Category name is required" }),
      { status: 400 }
    );
  }

  // Check if the category already exists
  const { data, error } = await supabase
    .from("income_category")
    .select("category_name")
    .eq("category_name", category_name)
    .single();

  if (data) {
    return new Response(JSON.stringify({ error: "Category already exists" }), {
      status: 400,
    });
  }

  // Insert new category
  const { error: insertError } = await supabase
    .from("income_category")
    .insert([{ category_name }]);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Category added successfully" }),
    { status: 200 }
  );
}
