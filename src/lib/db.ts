import { PrismaClient } from "@prisma/client";

// Singleton pattern for PrismaClient - works in serverless environments
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Check env vars in order of preference
  const databaseUrl =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!databaseUrl) {
    throw new Error(
      "No DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL env var set"
    );
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
}

// Initialize lazily - only when first used
let _prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = globalForPrisma.prisma ?? createPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = _prisma;
    }
  }
  return _prisma;
}

// Export getter instead of proxy
export const db = {
  get jobApplication() {
    return getPrisma().jobApplication;
  },
  get scanLog() {
    return getPrisma().scanLog;
  },
};

// Also export prisma directly for advanced use
export { getPrisma as prisma };

// Auto-cleanup function: delete records older than 30 days
export async function cleanupOldRecords(daysOld: number = 30): Promise<{
  deletedApplications: number;
  deletedLogs: number;
}> {
  const client = getPrisma();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);

  const deletedApps = await client.jobApplication.deleteMany({
    where: {
      createdAt: { lt: cutoff },
      status: { notIn: ["interview", "offer"] },
    },
  });

  const deletedLogs = await client.scanLog.deleteMany({
    where: {
      createdAt: { lt: cutoff },
    },
  });

  return {
    deletedApplications: deletedApps.count,
    deletedLogs: deletedLogs.count,
  };
}

// Helper: check if DB is available (env vars set)
export function isDbAvailable(): boolean {
  return !!(
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL
  );
}
