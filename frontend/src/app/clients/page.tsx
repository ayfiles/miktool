import { getClients } from "@/lib/api";
import ClientsPage from "@/components/clients/ClientsPage";

export default async function ClientsRoute() {
  const clients = await getClients();

  return (
    <main style={{ padding: 24 }}>
      <ClientsPage initialClients={clients} />
    </main>
  );
}
