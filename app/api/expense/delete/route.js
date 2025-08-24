import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { id } = await req.json();
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
    });
  }

  // Debugging: Log the ID received
  console.log("Attempting to delete expense with ID:", id);

  const { data, error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .select("*"); // Select to check if the data exists

  if (error) {
    console.error("Error deleting expense:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  if (!data || data.length === 0) {
    console.log("No expense found with ID:", id); // Log if no record is found
    return new Response(
      JSON.stringify({ error: "No expense deleted. Check id." }),
      { status: 404 }
    );
  }

  console.log("Deleted expense:", data); // Log the deleted data

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
