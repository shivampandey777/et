import { supabase } from "@/lib/supabase";

export async function GET(Request) {
  const url = new URL(Request.url);
  const timeFrame = url.searchParams.get("timeFrame") || "month";
  const category = url.searchParams.get("category"); // <-- Add this

  const today = new Date();
  let startDate;

  switch (timeFrame) {
    case "month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 5);
      break;
    case "day":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      break;
    default:
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 12);
  }

  const startDateISOString = startDate.toISOString();

  let query = supabase
    .from("expenses")
    .select("*")
    .gte("date", startDateISOString)
    .order("date", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
