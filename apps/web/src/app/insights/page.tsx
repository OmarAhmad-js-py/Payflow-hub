"use client";

import * as React from "react";
import Link from "next/link";
import { useInsights } from "../../lib/queries";

export default function InsightsPage() {
    const [windowDays, setWindowDays] = React.useState(14);
    const q = useInsights(windowDays);

    return (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: 26, margin: 0 }}>Risk insights</h1>
                    <p style={{ marginTop: 6, color: "#666" }}>
                        Rules-based anomaly detection (easily replaceable with an LLM later).
                    </p>
                </div>
                <Link href="/">Back</Link>
            </header>

            <section style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
                <label>Window days</label>
                <input
                    type="number"
                    min={3}
                    max={60}
                    value={windowDays}
                    onChange={(e) => setWindowDays(Number(e.target.value))}
                    style={{ width: 90, padding: 6 }}
                />
                <span style={{ color: "#666", fontSize: 12 }}>
                    Trace: {q.data?.traceId ?? "—"}
                </span>
            </section>

            {q.isLoading && <div style={{ marginTop: 14 }}>Loading…</div>}

            {q.isError && (
                <div style={{ marginTop: 14, border: "1px solid #eee", padding: 12, borderRadius: 10 }}>
                    Failed to load insights. Try again.
                </div>
            )}

            {q.data && (
                <>
                    <section style={{ marginTop: 16 }}>
                        <h2 style={{ fontSize: 16 }}>Anomalies</h2>
                        <div style={{ display: "grid", gap: 10 }}>
                            {q.data.anomalies.map((a, idx) => (
                                <div key={idx} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                                    <div style={{ fontWeight: 600 }}>
                                        {a.type} · <span style={{ color: "#666" }}>{a.severity}</span>
                                    </div>
                                    <div style={{ marginTop: 6, color: "#444" }}>{a.message}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section style={{ marginTop: 16 }}>
                        <h2 style={{ fontSize: 16 }}>Recommendations</h2>
                        <div style={{ display: "grid", gap: 10 }}>
                            {q.data.recommendations.map((r, idx) => (
                                <div key={idx} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                                    <div style={{ marginTop: 6, color: "#444" }}>{r.details}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}
