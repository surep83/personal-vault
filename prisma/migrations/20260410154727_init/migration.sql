-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceName" TEXT NOT NULL,
    "loginId" TEXT NOT NULL,
    "encryptedPassword" TEXT NOT NULL,
    "passwordIv" TEXT NOT NULL,
    "passwordAuthTag" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "category" TEXT,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "lastAccessedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Credential_serviceName_idx" ON "Credential"("serviceName");

-- CreateIndex
CREATE INDEX "Credential_isFavorite_idx" ON "Credential"("isFavorite");

-- CreateIndex
CREATE INDEX "Credential_createdAt_idx" ON "Credential"("createdAt");
