"use client";

import * as React from "react";
import Link from "next/link";
import { useApplications } from "./../lib/queries";
import { ApiError } from "./../lib/api";

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span style={{ padding: "2px 8px", border: "1px solid #ddd", borderRadius: 999 }}>
            {children}
        </span>
    );
}

export default function DashboardPage() {
    const [page, setPage] = React.useState(1);
    const pageSize = 20;

    const q = useApplications(page, pageSize);

    return (
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: 28, margin: 0 }}>PayFlow Hub</h1>
                    <p style={{ marginTop: 6, color: "#666" }}>
                        Fintech operations dashboard (BFF + API-first + resilient UI)
                    </p>
                </div>
                <nav style={{ display: "flex", gap: 12 }}>
                    <Link href="/insights">Risk insights</Link>
                </nav>
            </header>

            <section style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <Card title="Applications">{q.data?.total ?? "—"}</Card>
                <Card title="Page">{page}</Card>
                <Card title="Trace">{q.data?.traceId ?? "—"}</Card>
            </section>

            <section style={{ marginTop: 18 }}>
                <h2 style={{ fontSize: 18 }}>Applications</h2>

                {q.isLoading && <div>Loading…</div>}

                {q.isError && (
                    <ErrorPanel err={q.error as unknown} />
                )}

                {q.data && (
                    <>
                        <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 10 }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ textAlign: "left", background: "#fafafa" }}>
                                        <Th>ID</Th>
                                        <Th>Applicant</Th>
                                        <Th>Country</Th>
                                        <Th>Amount</Th>
                                        <Th>Status</Th>
                                        <Th>Risk</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {q.data.items.map((a) => (
                                        <tr key={a.id} style={{ borderTop: "1px solid #eee" }}>
                                            <Td>{a.id}</Td>
                                            <Td>{a.applicantName}</Td>
                                            <Td><Pill>{a.country}</Pill></Td>
                                            <Td>{a.amount.toLocaleString("en-US")} </Td>
                                            <Td><Pill>{a.status}</Pill></Td>
                                            <Td><Pill>{a.riskScore}</Pill></Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1 || q.isFetching}
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={q.isFetching || (q.data.items.length < pageSize)}
                            >
                                Next
                            </button>
                            {q.isFetching && <span style={{ color: "#666" }}>Updating…</span>}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "#666", fontSize: 12 }}>{title}</div>
            <div style={{ fontSize: 20, marginTop: 6 }}>{children}</div>
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return <th style={{ padding: 10, fontSize: 12, color: "#555" }}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
    return <td style={{ padding: 10 }}>{children}</td>;
}

function ErrorPanel({ err }: { err: unknown }) {
    const e = err as Partial<ApiError>;

    return (
        <div style={{ border: "1px solid #f5c2c7", background: "#f8d7da", padding: 12, borderRadius: 10 }}>
            <div style={{ fontWeight: 600 }}>Request failed</div>
            <div style={{ marginTop: 6 }}>
                {String(e.message ?? "Unknown error")}
            </div>
            <div style={{ marginTop: 6, fontSize: 12 }}>
                Code: <b>{String(e.code ?? "UNKNOWN")}</b> · Trace: <b>{String(e.traceId ?? "—")}</b>
            </div>
        </div>
    );
}
