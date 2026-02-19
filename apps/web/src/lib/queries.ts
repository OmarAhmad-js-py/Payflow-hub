import { useQuery } from "@tanstack/react-query";
import {
  ListApplicationsResponse,
  InsightsResponse
} from "../../../../packages/contracts/src";
import { z } from "zod";
import { getValidated } from "./api";

export function useApplications(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["applications", page, pageSize],
    queryFn: async () => {
      const { data, traceId } = await getValidated(
        `/api/applications?page=${page}&pageSize=${pageSize}`,
        ListApplicationsResponse as unknown as z.ZodSchema
      );
      return { ...(data as object), traceId };
    }
  });
}

export function useInsights(windowDays: number) {
  return useQuery({
    queryKey: ["insights", windowDays],
    queryFn: async () => {
      const { data, traceId } = await getValidated(
        `/api/insights?windowDays=${windowDays}`,
        InsightsResponse as unknown as z.ZodSchema
      );
      return { ...(data as object), traceId };
    }
  });
}
