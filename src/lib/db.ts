import { PrismaClient } from "@prisma/client";

// Singleton pattern - must be global to survive HMR in dev
// and to share connection pool across serverless invocations

let prismaClient: PrismaClient | null = null;

export function getDb(): PrismaClient {
  if (prismaClient) return prismaClient;

  const databaseUrl =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!databaseUrl) {
    throw new Error("Database URL not configured");
  }

  // Create new PrismaClient with explicit datasource URL
  prismaClient = new PrismaClient({
    log: ["error"],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  // Cache in global for dev HMR
  if (process.env.NODE_ENV !== "production") {
    const g = globalThis as any;
    if (!g.prisma) g.prisma = prismaClient;
  }

  return prismaClient;
}

// For convenience - but must call getDb() inside the request handler
// not at module level (which would fail in serverless cold start)
export const db = {
  jobApplication: {
    findMany: (...args: any[]) => getDb().jobApplication.findMany(...args),
    findUnique: (...args: any[]) => getDb().jobApplication.findUnique(...args),
    findFirst: (...args: any[]) => getDb().jobApplication.findFirst(...args),
    create: (...args: any[]) => getDb().jobApplication.create(...args),
    update: (...args: any[]) => getDb().jobApplication.update(...args),
    delete: (...args: any[]) => getDb().jobApplication.delete(...args),
    deleteMany: (...args: any[]) => getDb().jobApplication.deleteMany(...args),
    count: (...args: any[]) => getDb().jobApplication.count(...args),
    groupBy: (...args: any[]) => getDb().jobApplication.groupBy(...args),
  },
  scanLog: {
    findMany: (...args: any[]) => getDb().scanLog.findMany(...args),
    create: (...args: any[]) => getDb().scanLog.create(...args),
    deleteMany: (...args: any[]) => getDb().scanLog.deleteMany(...args),
    count: (...args: any[]) => getDb().scanLog.count(...args),
  },
  user: {
    findUnique: (...args: any[]) => getDb().user.findUnique(...args),
    findFirst: (...args: any[]) => getDb().user.findFirst(...args),
    findMany: (...args: any[]) => getDb().user.findMany(...args),
    create: (...args: any[]) => getDb().user.create(...args),
    update: (...args: any[]) => getDb().user.update(...args),
    delete: (...args: any[]) => getDb().user.delete(...args),
    count: (...args: any[]) => getDb().user.count(...args),
  },
};

// Auto-cleanup function: delete records older than 30 days
export async function cleanupOldRecords(daysOld: number = 30): Promise<{
  deletedApplications: number;
  deletedLogs: number;
}> {
  const prisma = getDb();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);

  const [deletedApps, deletedLogs] = await Promise.all([
    prisma.jobApplication.deleteMany({
      where: {
        createdAt: { lt: cutoff },
        status: { notIn: ["interview", "offer"] },
      },
    }),
    prisma.scanLog.deleteMany({
      where: {
        createdAt: { lt: cutoff },
      },
    }),
  ]);

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
