import { uk } from "@/copy/uk";

/** Customer-specific studio name. Set STUDIO_NAME per deployment. */
export function getStudioName(): string {
  return process.env.STUDIO_NAME?.trim() || uk.app.defaultStudioName;
}
