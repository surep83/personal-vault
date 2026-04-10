"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  credentialId: string;
  serviceName: string;
  onDeleted?: () => void;
};

export function DeleteCredentialDialog({ credentialId, serviceName, onDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/credentials/${credentialId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete credential");
      }
      setOpen(false);
      onDeleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        Delete
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-xl">
            <h3 className="text-lg font-semibold">Delete Credential</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium">{serviceName}</span>? This action cannot be undone.
            </p>
            {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
