import { decryptPassword, encryptPassword } from "@/lib/crypto";
import type {
  CreateCredentialInput,
  RevealedCredential,
  UpdateCredentialInput,
} from "@/lib/types";
import { credentialRepository } from "@/repositories/credential.repository";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class CredentialService {
  async listCredentials() {
    return credentialRepository.findMany();
  }

  async getCredentialById(id: string) {
    const credential = await credentialRepository.findById(id);
    if (!credential) {
      throw new NotFoundError("Credential not found");
    }
    return credential;
  }

  async createCredential(input: CreateCredentialInput) {
    const { password, ...rest } = input;
    const encrypted = encryptPassword(password);

    return credentialRepository.create({
      ...rest,
      ...encrypted,
    });
  }

  async updateCredential(id: string, input: UpdateCredentialInput) {
    const existing = await credentialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Credential not found");
    }

    const { password, ...rest } = input;

    const updateData: Record<string, unknown> = { ...rest };
    if (typeof password === "string") {
      Object.assign(updateData, encryptPassword(password));
    }

    return credentialRepository.updateById(id, updateData);
  }

  async revealPassword(id: string): Promise<RevealedCredential> {
    const credential = await credentialRepository.findEncryptedById(id);
    if (!credential) {
      throw new NotFoundError("Credential not found");
    }

    const password = decryptPassword({
      encryptedPassword: credential.encryptedPassword,
      passwordIv: credential.passwordIv,
      passwordAuthTag: credential.passwordAuthTag,
    });

    await credentialRepository.updateById(id, { lastAccessedAt: new Date() });

    return { id: credential.id, password };
  }

  async markAccessed(id: string) {
    const existing = await credentialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Credential not found");
    }

    return credentialRepository.updateById(id, { lastAccessedAt: new Date() });
  }

  async deleteCredential(id: string) {
    const existing = await credentialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Credential not found");
    }
    return credentialRepository.deleteById(id);
  }
}

export const credentialService = new CredentialService();
