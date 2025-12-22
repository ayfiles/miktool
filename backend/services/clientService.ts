import { supabase } from "../supabaseClient";
import { Client } from "../types/client";

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Client[];
}

export async function createClient(name: string): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return data as Client;
}

/* -----------------------------
   DELETE CLIENT (SAFE)
----------------------------- */
export async function deleteClient(clientId: string) {
  // 🔍 Check if client has any orders
  const { count, error: orderError } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("client_id", clientId);

  if (orderError) {
    throw orderError;
  }

  if (count && count > 0) {
    throw new Error(
      "Client has existing orders and cannot be deleted."
    );
  }

  // 🗑️ Delete client
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId);

  if (error) {
    throw error;
  }
}
