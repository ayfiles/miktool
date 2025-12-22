import { supabase } from "../supabaseClient";
import { v4 as uuid } from "uuid";

/* ===============================
   TYPES
================================ */
interface CreateOrderInput {
  clientId: string;
  items: {
    productId: string;
    color: string;
    size: string;
    quantity: number;
    branding: {
      method: string;
      position: string;
    };
  }[];
}

/* ===============================
   CREATE ORDER (orders + order_items)
================================ */
export async function createOrder(input: CreateOrderInput) {
  const orderId = uuid();

  // 1️⃣ Load client (customer_name is NOT NULL)
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("name")
    .eq("id", input.clientId)
    .single();

  if (clientError || !client) {
    throw clientError ?? new Error("Client not found");
  }

  // 2️⃣ Create order (WITH STATUS)
  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    client_id: input.clientId,
    customer_name: client.name,
    status: "draft", // ✅ NEW
    created_at: new Date().toISOString(),
  });

  if (orderError) {
    throw orderError;
  }

  // 3️⃣ Create order items
  const orderItems = input.items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    branding_method: item.branding.method,   // 🔧 optional, falls Spalte existiert
    branding_position: item.branding.position,
    created_at: new Date().toISOString(),
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw itemsError;
  }

  return { orderId };
}

/* ===============================
   GET ORDER BY ID (PDF + DETAIL)
================================ */
export async function getOrderById(orderId: string) {
  // 1️⃣ Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, client_id, customer_name, status, created_at")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("❌ getOrderById (order) failed:", orderError);
    throw orderError ?? new Error("Order not found");
  }

  // 2️⃣ Items + Product Name
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      id,
      product_id,
      color,
      size,
      quantity,
      branding_method,
      branding_position,
      products (
        name
      )
    `)
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("❌ getOrderById (items) failed:", itemsError);
    throw itemsError;
  }

  return {
    ...order,
    items: items ?? [],
  };
}

/* ---------------------------------
   DELETE ORDER (SAFE)
--------------------------------- */
export async function deleteOrder(orderId: string) {
  // 1️⃣ Delete order_items
  const { error: itemsError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", orderId);

  if (itemsError) {
    throw itemsError;
  }

  // 2️⃣ Delete order
  const { error: orderError } = await supabase
    .from("orders")
    .delete()
    .eq("id", orderId);

  if (orderError) {
    throw orderError;
  }
}
