import { z } from "zod";
import { StandardError } from "../../../../packages/contracts/src";

export class ApiError extends Error {
  code: string;
  traceId: string;
  status: number;

  constructor(message: string, code: string, traceId: string, status: number) {
    super(message);
    this.code = code;
    this.traceId = traceId;
    this.status = status;
  }
}

async function parseJsonSafely(res: Response) {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function getValidated<T>(
  url: string,
  schema: z.ZodSchema<T>
): Promise<{ data: T; traceId: string }> {
  const res = await fetch(url, { cache: "no-store" });
  const traceId = res.headers.get("x-trace-id") ?? "missing-trace-id";

  const json = await parseJsonSafely(res);

  if (!res.ok) {
    const parsed = StandardError.safeParse(json);
    const err = parsed.success
      ? parsed.data
      : { code: `HTTP_${res.status}`, message: "Request failed", traceId };

    throw new ApiError(err.message, err.code, err.traceId, res.status);
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiError("Invalid response shape", "INVALID_SHAPE", traceId, 500);
  }

  return { data: parsed.data, traceId };
}
