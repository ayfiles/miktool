"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/lib/api";
import { Product } from "@/types/product";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface EditProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States mit existierenden Daten initialisieren
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category || "");
  const [description, setDescription] = useState(product.description || "");
  const [colors, setColors] = useState(product.available_colors.join(", "));
  const [sizes, setSizes] = useState(product.available_sizes.join(", "));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanArray = (str: string) => 
        str.split(",").map((s) => s.trim()).filter((s) => s !== "");

      await updateProduct(product.id, {
        name,
        category,
        description,
        available_colors: cleanArray(colors),
        available_sizes: cleanArray(sizes),
      });

      toast.success("Product updated successfully");
      onOpenChange(false);
      router.refresh(); 
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">Category</Label>
              <Input id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-colors" className="text-right">Colors</Label>
              <Input id="edit-colors" value={colors} onChange={(e) => setColors(e.target.value)} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-sizes" className="text-right">Sizes</Label>
              <Input id="edit-sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-desc" className="text-right pt-2">Desc</Label>
              <Textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}