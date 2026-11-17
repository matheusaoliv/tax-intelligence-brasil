CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'ACCOUNTANT', 'OPERATOR', 'VIEWER');
CREATE TYPE "CalculationStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'SUCCEEDED', 'FAILED');
CREATE TYPE "DocumentType" AS ENUM ('DANFSE');
CREATE TYPE "DocumentStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'SUCCEEDED', 'FAILED');
CREATE TYPE "FiscalEngine" AS ENUM ('RTC_REGIME_REGULAR', 'RTC_SIMPLES_NACIONAL', 'DANFSE');

CREATE TABLE "User" (
  "id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Organization" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

CREATE TABLE "Membership" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "role" "MembershipRole" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Membership_organizationId_userId_key" ON "Membership"("organizationId", "userId");
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");
CREATE INDEX "Membership_organizationId_role_idx" ON "Membership"("organizationId", "role");

CREATE TABLE "Company" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "legalName" TEXT NOT NULL,
  "taxIdentifierEncrypted" TEXT NOT NULL,
  "taxIdentifierHash" TEXT NOT NULL,
  "taxIdentifierSuffix" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Company_organizationId_taxIdentifierHash_key" ON "Company"("organizationId", "taxIdentifierHash");
CREATE UNIQUE INDEX "Company_id_organizationId_key" ON "Company"("id", "organizationId");
CREATE INDEX "Company_organizationId_idx" ON "Company"("organizationId");

CREATE TABLE "FiscalCalculation" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "companyId" UUID,
  "engine" "FiscalEngine" NOT NULL,
  "status" "CalculationStatus" NOT NULL DEFAULT 'RECEIVED',
  "engineVersion" TEXT NOT NULL,
  "engineCommitSha" TEXT NOT NULL,
  "engineRepository" TEXT NOT NULL,
  "inputPayload" JSONB NOT NULL,
  "originalOutput" JSONB,
  "responseMetadata" JSONB,
  "errorCode" TEXT,
  "correlationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "FiscalCalculation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "FiscalCalculation_organizationId_createdAt_idx" ON "FiscalCalculation"("organizationId", "createdAt");
CREATE INDEX "FiscalCalculation_organizationId_status_idx" ON "FiscalCalculation"("organizationId", "status");
CREATE INDEX "FiscalCalculation_companyId_createdAt_idx" ON "FiscalCalculation"("companyId", "createdAt");
CREATE UNIQUE INDEX "FiscalCalculation_organizationId_correlationId_key" ON "FiscalCalculation"("organizationId", "correlationId");

CREATE TABLE "Document" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "companyId" UUID,
  "type" "DocumentType" NOT NULL,
  "status" "DocumentStatus" NOT NULL DEFAULT 'RECEIVED',
  "sourceXmlObjectKey" TEXT NOT NULL,
  "pdfObjectKey" TEXT,
  "engineVersion" TEXT NOT NULL,
  "engineCommitSha" TEXT NOT NULL,
  "engineRepository" TEXT NOT NULL,
  "errorCode" TEXT,
  "correlationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Document_organizationId_correlationId_key" ON "Document"("organizationId", "correlationId");
CREATE INDEX "Document_organizationId_createdAt_idx" ON "Document"("organizationId", "createdAt");
CREATE INDEX "Document_organizationId_status_idx" ON "Document"("organizationId", "status");
CREATE INDEX "Document_companyId_createdAt_idx" ON "Document"("companyId", "createdAt");

CREATE TABLE "Session" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "lastUsedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");
CREATE INDEX "Session_organizationId_expiresAt_idx" ON "Session"("organizationId", "expiresAt");

CREATE TABLE "AuditEvent" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "actorUserId" UUID,
  "action" TEXT NOT NULL,
  "resourceType" TEXT NOT NULL,
  "resourceId" TEXT,
  "metadata" JSONB,
  "correlationId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuditEvent_organizationId_createdAt_idx" ON "AuditEvent"("organizationId", "createdAt");
CREATE INDEX "AuditEvent_organizationId_resourceType_resourceId_idx" ON "AuditEvent"("organizationId", "resourceType", "resourceId");

ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Company" ADD CONSTRAINT "Company_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FiscalCalculation" ADD CONSTRAINT "FiscalCalculation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FiscalCalculation" ADD CONSTRAINT "FiscalCalculation_companyId_organizationId_fkey" FOREIGN KEY ("companyId", "organizationId") REFERENCES "Company"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_companyId_organizationId_fkey" FOREIGN KEY ("companyId", "organizationId") REFERENCES "Company"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
