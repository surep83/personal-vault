"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { DeleteCredentialDialog } from "@/components/credentials/delete-credential-dialog";
import { Button } from "@/components/ui/button";

type Credential = {
  id: string;
  serviceName: string;
  loginId: string;
  url: string;
  purpose: string;
  isFavorite: boolean;
  updatedAt: string;
};

type Props = {
  credentials: Credential[];
};

export function CredentialTable({ credentials }: Props) {
  const router = useRouter();

  if (credentials.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">No credentials yet.</p>
        <Button asChild className="mt-4">
          <Link href="/credentials/new">Add First Credential</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Service</th>
            <th className="px-4 py-3 text-left font-medium">Login</th>
            <th className="px-4 py-3 text-left font-medium">Purpose</th>
            <th className="px-4 py-3 text-left font-medium">URL</th>
            <th className="px-4 py-3 text-left font-medium">Updated</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>{item.serviceName}</span>
                  {item.isFavorite ? <span className="rounded bg-secondary px-2 py-0.5 text-xs">Favorite</span> : null}
                </div>
              </td>
              <td className="px-4 py-3">{item.loginId}</td>
              <td className="px-4 py-3">{item.purpose}</td>
              <td className="px-4 py-3">
                <a href={item.url} className="text-primary underline underline-offset-2" target="_blank" rel="noreferrer">
                  Open
                </a>
              </td>
              <td className="px-4 py-3">{new Date(item.updatedAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/credentials/${item.id}`}>View</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/credentials/${item.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteCredentialDialog
                    credentialId={item.id}
                    serviceName={item.serviceName}
                    onDeleted={() => router.refresh()}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
