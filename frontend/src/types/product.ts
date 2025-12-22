export interface Product {
    id: string;
    name: string;
    category?: string;
    description?: string | null;
    available_colors: string[];
    available_sizes: string[];
  }
  