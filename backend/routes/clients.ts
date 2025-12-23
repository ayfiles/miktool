import { Router } from "express";
import { supabase } from "../supabaseClient";
import { getClients, createClient, deleteClient, updateClient } from "../services/clientService"; // <--- updateClient importieren

const router = Router();

/* -----------------------------
   GET all clients
----------------------------- */
router.get("/", async (_req, res) => {
  try {
    const clients = await getClients();
    res.json(clients);
  } catch (error) {
    console.error("Failed to load clients:", error);
    res.status(500).json({ error: "Failed to load clients" });
  }
});

/* -----------------------------
   CREATE client
----------------------------- */
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Client name required" });
  }

  try {
    const client = await createClient(name);
    res.status(201).json(client);
  } catch (error) {
    console.error("Failed to create client:", error);
    res.status(500).json({ error: "Failed to create client" });
  }
});

/* -----------------------------
   GET orders by client (WITH STATUS + ITEM COUNT)
----------------------------- */
router.get("/:clientId/orders", async (req, res) => {
  const { clientId } = req.params;

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      order_items ( id )
    `)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(
    (data ?? []).map((order) => ({
      id: order.id,
      created_at: order.created_at,
      status: order.status,
      items_count: order.order_items?.length ?? 0,
    }))
  );
});


/* -----------------------------
   UPDATE client
----------------------------- */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Client name required" });
  }

  try {
    const updated = await updateClient(id, name);
    res.json(updated);
  } catch (error: any) {
    console.error("Failed to update client:", error);
    res.status(500).json({ error: error.message || "Failed to update client" });
  }
});
/* -----------------------------
   DELETE client (SAFE)
----------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteClient(id);
    res.status(204).send();
  } catch (error: any) {
    console.error("Failed to delete client:", error);
    res.status(500).json({
      error: error?.message ?? "Failed to delete client",
    });
  }
});

export default router;
