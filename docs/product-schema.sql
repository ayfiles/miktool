-- Product Database Schema for Textile MVP
-- PostgreSQL / Supabase compatible

-- Products table
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    available_colors TEXT[],
    available_sizes TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product assets table (for mockup generation)
CREATE TABLE product_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    view TEXT NOT NULL DEFAULT 'front',
    base_image TEXT NOT NULL,
    print_mask TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_product_assets_product_id
ON product_assets(product_id);

CREATE INDEX idx_product_assets_view
ON product_assets(view);
