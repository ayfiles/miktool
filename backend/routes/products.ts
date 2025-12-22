import { Router, Request, Response } from "express";
import { getAllProducts, getProductById } from "../services/productService";

const router = Router();

// GET /products
router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    // Make Supabase errors debuggable in local dev (no secrets included)
    const e = error as any;
    console.error("Failed to fetch products:", {
      message: e?.message,
      details: e?.details,
      hint: e?.hint,
      code: e?.code,
      raw: e,
    });

    res.status(500).json({
      error: e?.message ?? "Failed to load products",
      code: e?.code,
      details: e?.details,
      hint: e?.hint,
    });
  }
});

// GET /products/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;

