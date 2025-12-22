/**
 * Order Types – MVP / Production Ready
 * Used by Frontend + Backend
 */

export interface OrderBranding {
    method: "print";
    position: "front";
    design?: string; // optional: path / asset id / filename
  }
  
  export interface OrderItem {
    productId: string;
    color: string;
    size: string;
    quantity: number;
    branding: OrderBranding;
  }

  // Backwards-compatible alias used by some components
  export type OrderProduct = OrderItem;
  
  export interface Order {
    customer: {
      name: string;
    };
    products: OrderItem[];
    notes?: string;
  }
  