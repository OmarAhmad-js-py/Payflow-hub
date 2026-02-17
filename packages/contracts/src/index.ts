import { z } from "zod";

export const ApplicationStatus = z.enum(["PENDING", "APPROVED", "REJECTED", "REVIEW"]);
export type ApplicationStatus = z.infer<typeof ApplicationStatus>;

export const Application = z.object({
  id: z.string(),
  createdAt: z.string(),
  applicantName: z.string(),
  country: z.string(),
  amount: z.number(),
  status: ApplicationStatus,
  riskScore: z.number().min(0).max(100),
});

export type Application = z.infer<typeof Application>;

export const ListApplicationsResponse = z.object({
  items: z.array(Application),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type ListApplicationsResponse = z.infer<typeof ListApplicationsResponse>;

export const InsightsResponse = z.object({
  windowDays: z.number(),
  anomalies: z.array(z.object({
    type: z.string(),
    severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
    message: z.string(),
  })),
  recommendations: z.array(z.object({
    title: z.string(),
    details: z.string(),
  })),
});

export type InsightsResponse = z.infer<typeof InsightsResponse>;

export const StandardError = z.object({
  code: z.string(),
  message: z.string(),
  traceId: z.string(),
});
export type StandardError = z.infer<typeof StandardError>;
