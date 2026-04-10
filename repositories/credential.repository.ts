import type { Credential, Prisma } from "@prisma/client";

import { db } from "@/lib/db";

const credentialPublicSelect = {
  id: true,
  serviceName: true,
  loginId: true,
  url: true,
  purpose: true,
  category: true,
  notes: true,
  isFavorite: true,
  lastAccessedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CredentialSelect;

export class CredentialRepository {
  async create(data: Prisma.CredentialCreateInput) {
    return db.credential.create({
      data,
      select: credentialPublicSelect,
    });
  }

  async findMany() {
    return db.credential.findMany({
      select: credentialPublicSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return db.credential.findUnique({
      where: { id },
      select: credentialPublicSelect,
    });
  }

  async findEncryptedById(id: string): Promise<Credential | null> {
    return db.credential.findUnique({
      where: { id },
    });
  }

  async updateById(id: string, data: Prisma.CredentialUpdateInput) {
    return db.credential.update({
      where: { id },
      data,
      select: credentialPublicSelect,
    });
  }

  async deleteById(id: string) {
    return db.credential.delete({
      where: { id },
      select: credentialPublicSelect,
    });
  }
}

export const credentialRepository = new CredentialRepository();
