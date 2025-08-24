// app/api/category/delete/route.ts
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("income_category")
      .delete()
      .eq("id", id)
      .select("id"); // <-- important

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: "No category deleted. Check id." }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, deleted: data }), {
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e?.message || "Unexpected error" }),
      { status: 500 }
    );
  }
}
