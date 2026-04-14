"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EarlyAccessGate } from "@/components/early-access-gate";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Filter,
  X,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://regulance-backend-682132092035.asia-south1.run.app/api/v1";

const INR = (v: number) =>
  Number(v || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

const RISK_STYLE: Record<string, { bg: string; color: string; label: string }> =
  {
    CRITICAL: { bg: "rgba(220,38,38,0.08)", color: "#ef4444", label: "Critical" },
    WARNING: { bg: "rgba(234,179,8,0.08)", color: "#eab308", label: "Warning" },
    SAFE: { bg: "rgba(34,197,94,0.08)", color: "#22c55e", label: "Safe" },
  };

type PayableRecord = {
  id: string;
  vendor_id: string;
  vendor_name: string;
  msme_type: string | null;
  major_activity: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  total_amount: number;
  payment_status: string;
  days_outstanding: number;
  risk_status: string;
};

type VendorAction = {
  vendor_name: string;
  action: string;
  reason: string;
  priority: string;
};

type AIAnalysis = {
  executive_summary: string;
  tax_impact_estimate: number;
  vendor_actions: VendorAction[];
  mitigation_strategy: string;
};

type UploadResult = {
  rows_inserted: number;
  vendors_created: number;
  vendors_verified: number;
  total_critical_amount: number;
  total_warning_amount: number;
  total_safe_amount: number;
  records: PayableRecord[];
  errors: string[];
  ai_analysis: AIAnalysis | null;
  error?: string;
};

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  IMMEDIATE_PAYMENT: { label: "Pay Immediately", color: "#ef4444" },
  NEGOTIATE_TIMELINE: { label: "Negotiate", color: "#eab308" },
  REQUEST_CREDIT_NOTE: { label: "Credit Note", color: "#1a6d52" },
  VERIFY_MSME_STATUS: { label: "Verify Status", color: "#a1a1aa" },
};

export default function MSMETrackerPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [riskFilter, setRiskFilter] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [gateAction, setGateAction] = useState<string>("");

  useEffect(() => {
    // Check if user already submitted early access
    if (typeof window !== "undefined") {
      setHasAccess(localStorage.getItem("regulance_early_access") === "true");
    }
  }, []);

  const handleGateSuccess = () => {
    setHasAccess(true);
    localStorage.setItem("regulance_early_access", "true");
    setGateOpen(false);
  };

  const requireAccess = (action: string) => {
    if (hasAccess) return true;
    setGateAction(action);
    setGateOpen(true);
    return false;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // First upload is free, subsequent ones require access
    if (result && !requireAccess("upload")) {
      e.target.value = "";
      return;
    }

    setUploading(true);
    setResult(null);
    setAiAnalysis(null);
    setRiskFilter("");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/msme/demo/upload`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        setResult({ error: err.detail || "Upload failed" } as UploadResult);
      } else {
        const data: UploadResult = await res.json();
        setResult(data);
        if (data.ai_analysis) setAiAnalysis(data.ai_analysis);
      }
    } catch {
      setResult({ error: "Network error. Please try again." } as UploadResult);
    }

    setUploading(false);
    e.target.value = "";
  };

  const records = result?.records || [];
  const filtered = riskFilter
    ? records.filter((r) => r.risk_status === riskFilter)
    : records;

  const totals = result
    ? {
        total: records.length,
        totalAmount:
          (result.total_critical_amount || 0) +
          (result.total_warning_amount || 0) +
          (result.total_safe_amount || 0),
        critical: records.filter((r) => r.risk_status === "CRITICAL").length,
        criticalAmount: result.total_critical_amount || 0,
        warning: records.filter((r) => r.risk_status === "WARNING").length,
        warningAmount: result.total_warning_amount || 0,
        safe: records.filter((r) => r.risk_status === "SAFE").length,
        safeAmount: result.total_safe_amount || 0,
      }
    : null;

  return (
    <main className="min-h-screen bg-[#0a0a0c] relative">
      <div className="grid-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#1a6d52]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10 py-8 lg:py-12">
        {/* Back nav */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/regulance.png"
                    alt="Regulance"
                    width={24}
                    height={24}
                    className="rounded"
                  />
                </Link>
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1a6d52] bg-[#1a6d52]/10 px-2 py-0.5 rounded-full">
                  Free Tool
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-50">
                Section 43B(h) — MSME Payment Tracker
              </h1>
              <p className="mt-2 text-sm text-zinc-400 max-w-xl">
                Upload your Creditor Aging report to instantly identify
                disallowance risks under Section 43B(h). AI-powered analysis
                included.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/waitlist")}
              className="shrink-0"
            >
              Get Full Platform Access
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="dark-card rounded-xl p-5 mb-6"
        >
          <p className="text-sm font-semibold text-zinc-200 mb-3">
            Upload Creditor Aging Report
          </p>
          <label
            className="flex flex-col items-center gap-2 py-8 rounded-lg cursor-pointer transition-all"
            style={{
              border: `1.5px dashed ${uploading ? "#1a6d52" : "#1e1e22"}`,
              background: uploading ? "rgba(26,109,82,0.05)" : "rgba(14,14,18,0.6)",
            }}
          >
            {uploading ? (
              <div
                className="animate-spin h-5 w-5 rounded-full border-2"
                style={{
                  borderColor: "#1a6d52",
                  borderTopColor: "transparent",
                }}
              />
            ) : (
              <Upload className="h-5 w-5 text-zinc-600" />
            )}
            <span className="text-xs font-medium text-zinc-400">
              {uploading
                ? "Analyzing your data..."
                : "Drop or click to upload Excel / CSV"}
            </span>
            <span className="text-[11px] text-zinc-600">
              Expected: Vendor Name, PAN/URN, Invoice Date, Amount
            </span>
            <a
              href="/sample_creditor_aging.csv"
              download
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-[#1a6d52] hover:text-[#238c6a] underline underline-offset-2 transition-colors"
            >
              Download sample file
            </a>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleUpload}
              className="hidden"
            />
          </label>

          {/* Upload result message */}
          {result && !result.error && (
            <div
              className="mt-3 p-3 rounded-lg text-xs"
              style={{
                background: "rgba(34,197,94,0.06)",
                color: "#22c55e",
              }}
            >
              Analyzed {result.rows_inserted} records
              {result.vendors_created > 0 &&
                ` — ${result.vendors_created} vendors identified`}
              {result.vendors_verified > 0 &&
                ` — ${result.vendors_verified} verified via MSME API`}
            </div>
          )}
          {result?.error && (
            <div
              className="mt-3 p-3 rounded-lg text-xs"
              style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444" }}
            >
              {result.error}
            </div>
          )}
          {result?.errors && result.errors.length > 0 && (
            <div className="mt-2 text-[11px] text-zinc-600">
              {result.errors.map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
          )}
        </motion.div>

        {/* Dashboard */}
        {totals && totals.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                label="Total Payables"
                count={totals.total}
                amount={totals.totalAmount}
                color="#e4e4e7"
                bg="rgba(20,20,24,0.6)"
              />
              <MetricCard
                label="Critical (>45d)"
                count={totals.critical}
                amount={totals.criticalAmount}
                color="#ef4444"
                bg="rgba(220,38,38,0.06)"
                onClick={() =>
                  setRiskFilter(riskFilter === "CRITICAL" ? "" : "CRITICAL")
                }
                active={riskFilter === "CRITICAL"}
              />
              <MetricCard
                label="Warning (30-45d)"
                count={totals.warning}
                amount={totals.warningAmount}
                color="#eab308"
                bg="rgba(234,179,8,0.06)"
                onClick={() =>
                  setRiskFilter(riskFilter === "WARNING" ? "" : "WARNING")
                }
                active={riskFilter === "WARNING"}
              />
              <MetricCard
                label="Safe"
                count={totals.safe}
                amount={totals.safeAmount}
                color="#22c55e"
                bg="rgba(34,197,94,0.06)"
                onClick={() =>
                  setRiskFilter(riskFilter === "SAFE" ? "" : "SAFE")
                }
                active={riskFilter === "SAFE"}
              />
            </div>

            {/* AI Analysis */}
            <AIPanel analysis={aiAnalysis} />

            {/* Filter bar */}
            {riskFilter && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Filter className="h-3.5 w-3.5" />
                Showing <strong className="text-zinc-200">{riskFilter}</strong>{" "}
                records
                <button
                  onClick={() => setRiskFilter("")}
                  className="ml-1 hover:text-zinc-200 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Data Table */}
            <div className="dark-card rounded-xl overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr
                    className="text-[10px] font-semibold uppercase tracking-[0.05em] text-zinc-600"
                    style={{ borderBottom: "1px solid #1e1e22" }}
                  >
                    <th className="text-left py-3 px-4">Vendor</th>
                    <th className="text-left py-3 px-4">MSME</th>
                    <th className="text-left py-3 px-4 hidden sm:table-cell">Activity</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Invoice</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Date</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-center py-3 px-4">Days</th>
                    <th className="text-center py-3 px-4">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const rs = RISK_STYLE[r.risk_status] || RISK_STYLE.SAFE;
                    return (
                      <tr
                        key={r.id}
                        style={{ borderBottom: "1px solid rgba(30,30,34,0.5)" }}
                      >
                        <td className="py-2.5 px-4 font-medium text-zinc-200">
                          {r.vendor_name}
                        </td>
                        <td className="py-2.5 px-4">
                          {r.msme_type ? (
                            <span
                              className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold"
                              style={{
                                background:
                                  r.msme_type === "NON_MSME"
                                    ? "rgba(20,20,24,0.8)"
                                    : "rgba(26,109,82,0.1)",
                                color:
                                  r.msme_type === "NON_MSME"
                                    ? "#71717a"
                                    : "#1a6d52",
                              }}
                            >
                              {r.msme_type}
                            </span>
                          ) : (
                            <span className="text-zinc-700">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-xs text-zinc-600 hidden sm:table-cell">
                          {r.major_activity || "—"}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-xs text-zinc-500 hidden md:table-cell">
                          {r.invoice_number || "—"}
                        </td>
                        <td className="py-2.5 px-4 text-xs text-zinc-500 hidden md:table-cell">
                          {r.invoice_date
                            ? new Date(r.invoice_date).toLocaleDateString(
                                "en-IN"
                              )
                            : "—"}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-zinc-200">
                          {INR(r.total_amount)}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className="font-semibold"
                            style={{
                              color:
                                r.days_outstanding > 45
                                  ? "#ef4444"
                                  : r.days_outstanding >= 30
                                  ? "#eab308"
                                  : "#71717a",
                            }}
                          >
                            {r.days_outstanding}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: rs.bg, color: rs.color }}
                          >
                            {r.risk_status === "CRITICAL" && (
                              <ShieldAlert className="h-3 w-3" />
                            )}
                            {r.risk_status === "WARNING" && (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                            {r.risk_status === "SAFE" && (
                              <ShieldCheck className="h-3 w-3" />
                            )}
                            {rs.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom CTA */}
            <div className="dark-card rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-zinc-200 mb-1">
                Want to save results, track vendors, and automate compliance?
              </p>
              <p className="text-xs text-zinc-500 mb-4">
                The full Regulance platform does this and much more — GST Recon,
                TDS Matching, Vendor KYC, AI Audit Agent.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => {
                    if (requireAccess("export")) {
                      // Future: trigger export
                    }
                  }}
                  className="group"
                >
                  Get Early Access
                  <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    (window.location.href =
                      "mailto:shashank.kumar@regulance.co.in")
                  }
                >
                  Talk to Founders
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!result && !uploading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="dark-card rounded-xl p-10 text-center mt-4"
          >
            <ShieldAlert className="h-8 w-8 text-zinc-700 mx-auto mb-4" />
            <p className="text-sm font-medium text-zinc-400 mb-1">
              No data yet
            </p>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto">
              Upload a Creditor Aging report (Excel or CSV) above to instantly
              analyze your 43B(h) compliance exposure with AI-powered
              recommendations.
            </p>
          </motion.div>
        )}
      </Container>

      {/* Early Access Gate Modal */}
      <EarlyAccessGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onSuccess={handleGateSuccess}
        title="Unlock Full Access"
        subtitle={
          gateAction === "upload"
            ? "Sign up for early access to upload more files and track results over time."
            : gateAction === "export"
            ? "Sign up for early access to export reports and save your analysis."
            : "Sign up to unlock the full Regulance compliance platform."
        }
      />
    </main>
  );
}

/* ── Sub-components ── */

function MetricCard({
  label,
  count,
  amount,
  color,
  bg,
  onClick,
  active,
}: {
  label: string;
  count: number;
  amount: number;
  color: string;
  bg: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 transition-all border"
      onClick={onClick}
      style={{
        background: bg,
        cursor: onClick ? "pointer" : "default",
        borderColor: active ? color : "#1e1e22",
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.05em] mb-1"
        style={{ color }}
      >
        {label}
      </p>
      <p className="text-lg sm:text-xl font-bold" style={{ color }}>
        {INR(amount)}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color, opacity: 0.6 }}>
        {count} invoices
      </p>
    </div>
  );
}

function AIPanel({
  analysis,
}: {
  analysis: AIAnalysis | null;
}) {
  if (!analysis) return null;

  return (
    <div className="dark-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-[#1a6d52]" />
        <p className="text-sm font-semibold text-zinc-200">
          AI Advisory — Section 43B(h)
        </p>
      </div>

      <div className="space-y-4">
        {/* Executive Summary */}
        <div
          className="p-3 rounded-lg"
          style={{ background: "rgba(14,14,18,0.8)" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-zinc-600 mb-1.5">
            Executive Summary
          </p>
          <p className="text-[13px] leading-relaxed text-zinc-300">
            {analysis.executive_summary}
          </p>
          {analysis.tax_impact_estimate > 0 && (
            <p className="text-xs font-semibold mt-2 text-red-400">
              Estimated Tax Impact: {INR(analysis.tax_impact_estimate)}
            </p>
          )}
        </div>

        {/* Vendor Actions */}
        {analysis.vendor_actions?.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-zinc-600 mb-2">
              Recommended Actions
            </p>
            <div className="space-y-1.5">
              {analysis.vendor_actions.slice(0, 6).map((a, i) => {
                const actionStyle = ACTION_LABELS[a.action] || {
                  label: a.action,
                  color: "#a1a1aa",
                };
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2.5 rounded-lg"
                    style={{ background: "rgba(14,14,18,0.8)" }}
                  >
                    <span
                      className="shrink-0 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-0.5"
                      style={{
                        background:
                          a.priority === "HIGH"
                            ? "rgba(220,38,38,0.1)"
                            : "rgba(234,179,8,0.1)",
                        color: a.priority === "HIGH" ? "#ef4444" : "#eab308",
                      }}
                    >
                      {a.priority}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-zinc-200">
                          {a.vendor_name}
                        </span>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                          style={{ color: actionStyle.color }}
                        >
                          {actionStyle.label}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5 text-zinc-500">
                        {a.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mitigation Strategy */}
        {analysis.mitigation_strategy && (
          <div
            className="p-3 rounded-lg"
            style={{ background: "rgba(26,109,82,0.06)", border: "1px solid rgba(26,109,82,0.1)" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#1a6d52] mb-1.5">
              Mitigation Strategy
            </p>
            <p className="text-xs leading-relaxed text-zinc-300">
              {analysis.mitigation_strategy}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
