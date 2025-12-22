"use client";

import Link from "next/link";
import DeleteOrderButton from "@/components/order/DeleteOrderButton";

function getStatusLabel(status: string) {
  switch (status) {
    case "draft": return "Draft";
    case "confirmed": return "Confirmed";
    case "production": return "In Production";
    case "done": return "Done";
    default: return status;
  }
}

export default function ClientOrdersClient({
  clientId,
  initialOrders,
}: {
  clientId: string;
  initialOrders: any[];
}) {
  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1>Client Orders</h1>

      <Link href={`/orders/new?clientId=${clientId}`}>
        ➕ Create new order
      </Link>

      <div style={{ marginTop: 24 }}>
        {initialOrders.length === 0 && <p>No orders yet.</p>}

        {initialOrders.map((order) => (
          <div
            key={order.id}
            style={{
              padding: 16,
              marginBottom: 12,
              borderRadius: 8,
              background: "#111",
              border: "1px solid #222",
            }}
          >
            <strong>Order #{order.id.slice(0, 8)}</strong>

            <div style={{ fontSize: 14, opacity: 0.7 }}>
              {new Date(order.created_at).toLocaleString()}
            </div>

            {/* STATUS */}
            <select
              value={order.status}
              onChange={async (e) => {
                await fetch(
                  `http://localhost:3001/orders/${order.id}/status`,
                  {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: e.target.value }),
                  }
                );
                location.reload();
              }}
            >
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="production">Production</option>
              <option value="done">Done</option>
            </select>

            <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
              <a
                href={`http://localhost:3001/orders/${order.id}/pdf`}
                target="_blank"
              >
                PDF
              </a>

              <DeleteOrderButton orderId={order.id} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
