"use client";

import { deleteOrder } from "@/lib/api";

interface Props {
  orderId: string;
}

export default function DeleteOrderButton({ orderId }: Props) {
  async function onDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?\nThis cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteOrder(orderId);
      window.location.reload();
    } catch {
      alert("Failed to delete order");
    }
  }

  return (
    <button
      onClick={onDelete}
      style={{
        color: "#ff6b6b",
        background: "transparent",
        border: "1px solid #ff6b6b",
        borderRadius: 4,
        padding: "4px 8px",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  );
}
