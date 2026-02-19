import type { TadarusDTO } from "../dto/tadarusDto";
import type { TadarusItemDto } from "../dto/tadarusItemDto";
import type { TadarusUserDto } from "../dto/tadarusUserDto";
import supabase from "../utils/supabase";

export async function getTadarus(): Promise<TadarusDTO[]> {
  console.log("getTadarus start");
  const { data, error } = await supabase.from("tadarus").select("*");
  // .order("created_at", { ascending: false });

  console.log("Tadarus Data", data);
  if (error) throw error;
  return data || [];
}

export async function getItemCountsByTadarus(): Promise<
  Record<number, number>
> {
  const { data, error } = await supabase
    .from("tadarus_item")
    .select("tadarus_id");
  if (error) throw error;
  const counts: Record<number, number> = {};
  for (const row of data || []) {
    counts[row.tadarus_id] = (counts[row.tadarus_id] ?? 0) + 1;
  }
  return counts;
}

export async function getTadarusById(id: number): Promise<TadarusDTO | null> {
  const { data, error } = await supabase
    .from("tadarus")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTadarus(name: string, description: string) {
  const { error } = await supabase.from("tadarus").insert([
    {
      name,
      description,
    },
  ]);
  if (error) throw error;
}

export async function getTadarusUsersByTadarus(
  tadarusId: number,
): Promise<TadarusUserDto[]> {
  const { data, error } = await supabase
    .from("tadarus_user")
    .select("*")
    .eq("tadarus_id", tadarusId);
  if (error) throw error;
  return data || [];
}

export async function createTadarusUser(name: string, tadarusId: string) {
  const { error } = await supabase.from("tadarus_user").insert([
    {
      name,
      tadarus_id: Number(tadarusId),
    },
  ]);

  if (error) throw error;
}

export async function getTadarusItems(
  tadarusId: number,
): Promise<TadarusItemDto[]> {
  const { data, error } = await supabase
    .from("tadarus_item")
    .select("*")
    .eq("tadarus_id", tadarusId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTadarusItem(payload: any) {
  const { error } = await supabase.from("tadarus_item").insert([payload]);

  if (error) throw error;
}
