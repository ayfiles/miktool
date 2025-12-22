import OrderForm from "@/components/order/OrderForm";
import { getProducts } from "@/lib/api";

interface Props {
  searchParams: Promise<{ clientId?: string }> | { clientId?: string };
}

export default async function NewOrderPage({ searchParams }: Props) {
  const products = await getProducts();
  const sp = await searchParams;
  const clientId = sp.clientId ?? null;

  return (
    <main style={{ padding: 24 }}>
      <OrderForm
        products={products}
        clientId={clientId}
      />
    </main>
  );
}
