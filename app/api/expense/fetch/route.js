import { supabase } from "@/lib/supabase";

export async function GET(Request) {
  const url = new URL(Request.url);
  const timeFrame = url.searchParams.get("timeFrame") || "month"; // Default to "month"

  const today = new Date();
  let startDate;

  switch (timeFrame) {
    case "month":
      // For the current month, get the first day of the month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
      break;
    case "year":
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 5); // Last 5 years
      break;
    case "day":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30); // Last 30 days
      break;
    default:
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 12); // Default to last 12 months
  }

  // Convert the startDate to an ISO string for proper comparison
  const startDateISOString = startDate.toISOString();

  // Fetch data from Supabase with the updated startDate
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", startDateISOString) // Fetch data greater than or equal to the start date
    .order("date", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
