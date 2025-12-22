"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import styles from "./OrderForm.module.css";

type BrandingMethod = "print" | "embroidery";
type BrandingPosition = "front" | "back";

interface OrderItem {
  productId: string;
  color: string;
  size: string;
  quantity: number;
  branding: {
    method: BrandingMethod;
    position: BrandingPosition;
  };
}

interface Props {
  products: Product[];
  clientId: string | null;
}

export default function OrderForm({ products, clientId }: Props) {
  /* -----------------------------
     Temporary item selection
  ----------------------------- */
  const [productId, setProductId] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState<BrandingMethod>("print");
  const [position, setPosition] = useState<BrandingPosition>("front");

  /* -----------------------------
     Order state
  ----------------------------- */
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === productId);

  function getProduct(id: string) {
    return products.find((p) => p.id === id);
  }

  /* -----------------------------
     Add + Merge Items
  ----------------------------- */
  function addItem() {
    if (!productId || !color || !size || quantity < 1) {
      setError("Please select product, color, size and quantity.");
      return;
    }

    setItems((prev) => {
      const index = prev.findIndex(
        (i) =>
          i.productId === productId &&
          i.color === color &&
          i.size === size &&
          i.branding.method === method &&
          i.branding.position === position
      );

      if (index !== -1) {
        return prev.map((i, idx) =>
          idx === index
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [
        ...prev,
        {
          productId,
          color,
          size,
          quantity,
          branding: { method, position },
        },
      ];
    });

    setProductId("");
    setColor("");
    setSize("");
    setQuantity(1);
    setMethod("print");
    setPosition("front");
    setError(null);
  }

  function updateItem(index: number, updates: Partial<OrderItem>) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, ...updates } : item
      )
    );
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function increaseQty(index: number) {
    updateItem(index, {
      quantity: items[index].quantity + 1,
    });
  }

  function decreaseQty(index: number) {
    if (items[index].quantity === 1) return;
    updateItem(index, {
      quantity: items[index].quantity - 1,
    });
  }

  /* -----------------------------
     Submit Order (CLIENT AWARE)
  ----------------------------- */
  async function submitOrder() {
    if (!clientId) {
      setError("No client selected.");
      return;
    }

    if (items.length === 0) {
      setError("Add at least one item.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      clientId,
      items: items.map((i) => ({
        productId: i.productId,
        color: i.color,
        size: i.size,
        quantity: i.quantity,
        branding: i.branding,
      })),
    };

    try {
      const res = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setOrderId(data.orderId);
      setItems([]);
    } catch {
      setError("Failed to create order");
    } finally {
      setLoading(false);
    }
  }

  function downloadPdf() {
    if (!orderId) return;
    window.open(
      `http://localhost:3001/orders/${orderId}/pdf`,
      "_blank"
    );
  }

  /* -----------------------------
     Render
  ----------------------------- */
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Order Tool</h2>

      {/* ADD PRODUCT */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Add Product</h3>

        <select
          className={styles.select}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {selectedProduct && (
          <>
            <select
              className={styles.select}
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="">Color</option>
              {selectedProduct.available_colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">Size</option>
              {selectedProduct.available_sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <input
              className={styles.input}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <select
              className={styles.select}
              value={method}
              onChange={(e) =>
                setMethod(e.target.value as BrandingMethod)
              }
            >
              <option value="print">Print</option>
              <option value="embroidery">Embroidery</option>
            </select>

            <select
              className={styles.select}
              value={position}
              onChange={(e) =>
                setPosition(e.target.value as BrandingPosition)
              }
            >
              <option value="front">Front</option>
              <option value="back">Back</option>
            </select>

            <button
              className={styles.secondaryButton}
              onClick={addItem}
            >
              Add Item
            </button>
          </>
        )}
      </div>

      {/* ITEMS */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Items</h3>

        <div className={styles.itemsList}>
          {items.map((item, i) => {
            const product = getProduct(item.productId);

            return (
              <div key={i} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <strong>{product?.name ?? item.productId}</strong>

                  <select
                    className={styles.select}
                    value={item.color}
                    onChange={(e) =>
                      updateItem(i, { color: e.target.value })
                    }
                  >
                    {product?.available_colors.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    className={styles.select}
                    value={item.size}
                    onChange={(e) =>
                      updateItem(i, { size: e.target.value })
                    }
                  >
                    {product?.available_sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <select
                    className={styles.select}
                    value={item.branding.method}
                    onChange={(e) =>
                      updateItem(i, {
                        branding: {
                          ...item.branding,
                          method: e.target.value as BrandingMethod,
                        },
                      })
                    }
                  >
                    <option value="print">Print</option>
                    <option value="embroidery">Embroidery</option>
                  </select>

                  <select
                    className={styles.select}
                    value={item.branding.position}
                    onChange={(e) =>
                      updateItem(i, {
                        branding: {
                          ...item.branding,
                          position: e.target.value as BrandingPosition,
                        },
                      })
                    }
                  >
                    <option value="front">Front</option>
                    <option value="back">Back</option>
                  </select>
                </div>

                <div className={styles.itemActions}>
                  <button onClick={() => decreaseQty(i)}>−</button>
                  <strong>{item.quantity}</strong>
                  <button onClick={() => increaseQty(i)}>+</button>
                  <button onClick={() => removeItem(i)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button
          className={styles.primaryButton}
          onClick={submitOrder}
          disabled={loading}
        >
          {loading ? "Creating…" : "Create Order"}
        </button>

        {error && <p className={styles.error}>{error}</p>}

        {orderId && (
          <>
            <p className={styles.success}>
              Order created successfully (ID: {orderId})
            </p>
            <button
              className={styles.secondaryButton}
              onClick={downloadPdf}
            >
              Download Production Sheet (PDF)
            </button>
          </>
        )}
      </div>
    </section>
  );
}
