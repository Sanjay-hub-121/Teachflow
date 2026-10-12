export class AppError extends Error {
  constructor(message: string) {
    super(message.slice(0, 280));
    this.name = "AppError";
  }
}

export function errorText(error: unknown): string {
  if (error instanceof Error && error.message && error.message !== "Unauthorized") {
    return error.message.slice(0, 280);
  }
  return "Something went wrong. Please try again.";
}

export function rethrowKnown(error: unknown): never {
  if (error instanceof AppError) throw error;
  if (error instanceof Error && error.message === "Unauthorized") throw error;
  console.error("[teachflow]", error instanceof Error ? error.message : "unknown error");
  throw new AppError("Something went wrong. Please try again.");
}
