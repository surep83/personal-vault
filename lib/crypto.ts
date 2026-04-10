import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

export type EncryptedPayload = {
  encryptedPassword: string;
  passwordIv: string;
  passwordAuthTag: string;
};

function getEncryptionKey(): Buffer {
  const key = process.env.CREDENTIAL_ENCRYPTION_KEY;

  if (!key) {
    throw new Error("CREDENTIAL_ENCRYPTION_KEY is not configured");
  }

  const keyBuffer = Buffer.from(key, "base64");

  if (keyBuffer.length !== 32) {
    throw new Error(
      "CREDENTIAL_ENCRYPTION_KEY must be a base64-encoded 32-byte key",
    );
  }

  return keyBuffer;
}

export function encryptPassword(plainPassword: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plainPassword, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedPassword: encrypted.toString("base64"),
    passwordIv: iv.toString("base64"),
    passwordAuthTag: authTag.toString("base64"),
  };
}

export function decryptPassword(payload: EncryptedPayload): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(payload.passwordIv, "base64");
  const authTag = Buffer.from(payload.passwordAuthTag, "base64");
  const encrypted = Buffer.from(payload.encryptedPassword, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
