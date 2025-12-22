import { getOrdersByClient } from "@/lib/api";
import ClientOrdersClient from "@/components/order/ClientOrdersClient";

interface Props {
  params: {
    clientId: string;
  };
}

export default async function ClientOrdersPage({ params }: Props) {
  const { clientId } = params;

  // ✅ Server darf async
  const orders = await getOrdersByClient(clientId);

  return (
    <ClientOrdersClient
      clientId={clientId}
      initialOrders={orders}
    />
  );
}
