import { NextResponse } from "next/server";
import { ListApplicationsResponse, StandardError } from "../../../../../../packages/contracts/src";
import { fetchJsonValidated, getTraceId } from "../../../../src/lib/bff";
import { z } from "zod";

export async function GET(req: Request) {
  const traceId = getTraceId(req);
  const url = new URL(req.url);
  const page = url.searchParams.get("page") ?? "1";
  const pageSize = url.searchParams.get("pageSize") ?? "20";

  const upstream = `http://localhost:8080/applications?page=${page}&pageSize=${pageSize}`;

  const result = await fetchJsonValidated(upstream, (ListApplicationsResponse as unknown as z.ZodSchema), traceId);

  if (!result.ok) {
    const err = StandardError.parse(result.error);
    return NextResponse.json(err, { status: 502, headers: { "x-trace-id": traceId } });
  }

  return NextResponse.json(result.data, { headers: { "x-trace-id": traceId } });
}
