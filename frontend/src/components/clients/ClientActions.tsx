"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteClient } from "@/lib/api";
import { Client } from "@/types/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditClientDialog } from "./EditClientDialog";
import Link from "next/link";

interface ClientActionsProps {
  client: Client;
}

export function ClientActions({ client }: ClientActionsProps) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${client.name}"?`)) return;

    setLoading(true);
    try {
      await deleteClient(client.id);
      toast.success("Client deleted");
      router.refresh();
    } catch (error: any) {
      // API Error (z.B. Client hat Bestellungen) anzeigen
      toast.error(error.message || "Failed to delete client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
             <Link href={`/clients/${client.id}`} className="cursor-pointer">
                <FolderOpen className="mr-2 h-4 w-4" /> Open
             </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Name
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDelete} 
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            disabled={loading}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditClientDialog 
        client={client} 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog} 
      />
    </>
  );
}