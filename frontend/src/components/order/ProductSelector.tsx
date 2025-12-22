"use client";

import { Product } from "@/types/product";

interface Props {
  products: Product[];
  value: string;
  onChange: (productId: string) => void;
}

export default function ProductSelector({ products, value, onChange }: Props) {
  return (
    <div>
      <label>Product</label><br />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
