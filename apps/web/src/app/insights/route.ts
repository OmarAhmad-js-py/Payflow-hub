import { NextResponse } from "next/server";
import { InsightsResponse, StandardError } from "../../../..//../packages/contracts/src";
import { fetchJsonValidated, getTraceId } from "../../lib/bff";
import { z } from "zod";

export async function GET(req: Request) {
  const traceId = getTraceId(req);
  const url = new URL(req.url);
  const windowDays = url.searchParams.get("windowDays") ?? "14";

  const upstream = `http://localhost:8080/insights?windowDays=${windowDays}`;
  const result = await fetchJsonValidated(upstream, InsightsResponse as unknown as z.ZodSchema, traceId);

  if (!result.ok) {
    return NextResponse.json(result.error, { status: 502, headers: { "x-trace-id": traceId } });
  }

  return NextResponse.json(result.data, { headers: { "x-trace-id": traceId } });
}
