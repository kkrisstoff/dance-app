export type DeductErrorCode = "not_found" | "no_package" | "expired" | "empty" | "already_today";

export class DeductError extends Error {
  constructor(public code: DeductErrorCode) {
    super(code);
  }
}
