/**
 * TypeScript type definitions for Order JSON Schema (MVP)
 * Synced with order-schema.json
 */

export interface Customer {
    name: string;
    contactPerson?: string;
    address?: string;
  }
  
  export interface BrandingDesign {
    file: string;
    notes?: string;
  }
  
  export interface Branding {
    method: "print";
    position: "front";
    design: BrandingDesign;
  }
  
  export interface Product {
    productId: string;
    color: string;
    sizes: Record<string, number>; // e.g. { M: 40, L: 60 }
    quantity?: number; // optional, can be derived from sizes
    branding: Branding;
  }
  
  export interface Order {
    orderId: string;
    createdAt: string; // ISO 8601 date-time
    customer: Customer;
    products: Product[]; // 1–3 products in MVP
    notes?: string;
  }
  