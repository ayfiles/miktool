import { Product } from "@/types/product";
import { Client } from "@/types/client";

const API_BASE_URL = "http://localhost:3001";

/* -----------------------------
   PRODUCTS
----------------------------- */
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

/* -----------------------------
   CLIENTS
----------------------------- */
export async function getClients() {
  const res = await fetch("http://localhost:3001/clients", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch clients");
  }

  return res.json();
}


export async function createClient(name: string): Promise<Client> {
  const res = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to create client");
  }

  return res.json();
}
export async function getOrdersByClient(clientId: string) {
  const res = await fetch(
    `http://localhost:3001/clients/${clientId}/orders`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Orders API error:", text);
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

export async function deleteClient(clientId: string) {
  const res = await fetch(`http://localhost:3001/clients/${clientId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete client");
  }
}

export async function deleteOrder(orderId: string) {
  const res = await fetch(
    `http://localhost:3001/orders/${orderId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete order");
  }
}


