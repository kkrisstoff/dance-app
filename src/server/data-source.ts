export type DataSource = "demo" | "sqlite";

/**
 * Which store the app reads.
 *
 * - demo: built-in students, no database. Used on Vercel until Turso is connected.
 * - sqlite: local dance.db.
 *
 * Set DATA_SOURCE to override. When Turso is added, branch here and keep
 * getStudentById as the only function pages call.
 */
export function getDataSource(): DataSource {
  const explicit = process.env.DATA_SOURCE;
  if (explicit === "demo" || explicit === "sqlite") return explicit;
  if (process.env.VERCEL) return "demo";
  return "sqlite";
}

/** Demo students are built in, so nothing can be added, paid, or deducted. */
export function isReadOnly(): boolean {
  return getDataSource() === "demo";
}

export class ReadOnlyError extends Error {
  constructor() {
    super("read_only");
  }
}
