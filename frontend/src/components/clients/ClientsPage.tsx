"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Client } from "@/types/client";
import { createClient, deleteClient } from "@/lib/api";
import styles from "./ClientsPage.module.css";

type Props = {
  initialClients: Client[];
};

export default function ClientsPage({ initialClients }: Props) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------
     Filter
  ----------------------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(q));
  }, [clients, query]);

  /* -----------------------------
     Create Client
  ----------------------------- */
  async function onCreateClient() {
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const created = await createClient(trimmed);
      setClients((prev) => [created, ...prev]);
      setName("");
    } catch (e: any) {
      setError(e?.message || "Failed to create client");
    } finally {
      setLoading(false);
    }
  }

  /* -----------------------------
     Delete Client (WITH CONFIRM)
  ----------------------------- */
  async function onDeleteClient(client: Client) {
    const confirmed = window.confirm(
      `⚠️ Delete client "${client.name}"?\n\nThis action is permanent.\nClients with existing orders cannot be deleted.`
    );

    if (!confirmed) return;

    try {
      await deleteClient(client.id);
      setClients((prev) => prev.filter((c) => c.id !== client.id));
    } catch (e: any) {
      alert(e?.message || "Failed to delete client");
    }
  }

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Clients</h1>
          <p className={styles.subTitle}>Select a client to view orders.</p>
        </div>
      </header>

      <div className={styles.grid}>
        {/* LEFT: CLIENT LIST */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>All Clients</h2>

            <input
              className={styles.input}
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className={styles.list}>
            {filtered.length === 0 ? (
              <p className={styles.muted}>No clients found.</p>
            ) : (
              filtered.map((c) => (
                <div key={c.id} className={styles.clientRow}>
                  <Link href={`/clients/${c.id}`} className={styles.clientName}>
                    {c.name}
                  </Link>

                  <div className={styles.clientActions}>
                    <Link href={`/clients/${c.id}`} className={styles.openLink}>
                      Open →
                    </Link>

                    <button
                      className={styles.deleteButton}
                      onClick={() => onDeleteClient(c)}
                      title="Delete client"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: CREATE CLIENT */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>New Client</h2>
            <p className={styles.muted}>
              Add a new client folder (e.g. “Hotel ABC”, “Walk-In Customer”).
            </p>
          </div>

          <div className={styles.formRow}>
            <input
              className={styles.input}
              placeholder="Client name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onCreateClient();
              }}
            />
            <button
              className={styles.primaryButton}
              onClick={onCreateClient}
              disabled={loading}
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </section>
  );
}
