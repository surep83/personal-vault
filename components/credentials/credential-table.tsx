"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { DeleteCredentialDialog } from "@/components/credentials/delete-credential-dialog";
import { Button } from "@/components/ui/button";

type Credential = {
  id: string;
  serviceName: string;
  loginId: string;
  purpose: string;
  category: string | null;
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
    <div className="rounded-xl border bg-card">
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Service</th>
              <th className="px-4 py-3 text-left font-medium">Login ID</th>
              <th className="px-4 py-3 text-left font-medium">Purpose</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3 font-medium">{item.serviceName}</td>
                <td className="px-4 py-3">{item.loginId}</td>
                <td className="px-4 py-3">{item.purpose}</td>
                <td className="px-4 py-3">{item.category || "-"}</td>
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

      <div className="space-y-3 p-4 sm:hidden">
        {credentials.map((item) => (
          <div key={item.id} className="rounded-lg border p-3">
            <p className="font-medium">{item.serviceName}</p>
            <p className="text-sm text-muted-foreground">{item.loginId}</p>
            <p className="mt-2 text-sm">Purpose: {item.purpose}</p>
            <p className="text-sm">Category: {item.category || "-"}</p>
            <div className="mt-3 flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/credentials/${item.id}`}>View</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/credentials/${item.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
