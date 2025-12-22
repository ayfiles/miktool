import { OrderProduct } from "@/types/order";

interface Props {
  items: OrderProduct[];
  onRemove: (index: number) => void;
}

export default function OrderItemsList({ items, onRemove }: Props) {
  if (items.length === 0) {
    return <p style={{ opacity: 0.6 }}>No items added yet.</p>;
  }

  return (
    <>
      <h3>Items</h3>
      <ul>
        {items.map((item, i) => (
          <li key={i}>
            <span>
              <strong>{item.productId}</strong><br />
              {item.color} · {item.size} · Qty {item.quantity}
            </span>
            <button onClick={() => onRemove(i)}>Remove</button>
          </li>
        ))}
      </ul>
    </>
  );
}
