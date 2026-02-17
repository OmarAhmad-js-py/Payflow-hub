import { z } from "zod";
import { randomUUID } from "crypto";

export type BffResult<T> =
  | { ok: true; data: T; traceId: string }
  | { ok: false; error: { code: string; message: string; traceId: string } };

export function getTraceId(req: Request) {
  return req.headers.get("x-trace-id") ?? randomUUID();
}

export async function fetchJsonValidated<T>(
  url: string,
  schema: z.ZodSchema<T>,
  traceId: string,
  init?: RequestInit
): Promise<BffResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        "content-type": "application/json",
        "x-trace-id": traceId,
      },
      cache: "no-store",
    });

    const text = await res.text();
    const json = text ? JSON.parse(text) : null;

    if (!res.ok) {
      return {
        ok: false,
        error: {
          code: `UPSTREAM_${res.status}`,
          message: json?.detail || "Upstream error",
          traceId,
        },
      };
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return {
        ok: false,
        error: { code: "INVALID_UPSTREAM_SHAPE", message: "Invalid response shape", traceId },
      };
    }

    return { ok: true, data: parsed.data, traceId };
  } catch {
    return { ok: false, error: { code: "NETWORK_ERROR", message: "Network error", traceId } };
  }
}
