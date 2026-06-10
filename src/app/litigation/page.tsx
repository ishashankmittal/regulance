"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EarlyAccessGate } from "@/components/early-access-gate";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Scale,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Download,
  BookOpen,
  Sparkles,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://regulance-backend-682132092035.asia-south1.run.app/api/v1";

const INR = (v: number) =>
  Number(v || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });

type Claim = {
  description: string;
  amount: number;
  section_reference?: string;
};

type Extraction = {
  gstin?: string;
  financial_year?: string;
  notice_date?: string;
  notice_reference?: string;
  discrepancy_amount?: number;
  questioned_invoice_numbers?: string[];
  claims?: Claim[];
  summary?: string;
  error?: string;
};

type FoundInvoice = {
  invoice_number: string;
  vendor_name?: string;
  total_value?: number;
};

type CrossRef = {
  found?: FoundInvoice[];
  not_found?: string[];
  summary?: string;
};

type Precedent = {
  title?: string;
  snippet?: string;
  document_type?: string;
  source?: string;
  file_url?: string;
};

type Deadline = {
  deadline_date?: string;
  days_remaining?: number;
  urgency?: string;
  response_window?: string;
};

type AnalyseResult = {
  status: string;
  filename?: string;
  notice_type?: string;
  extraction?: Extraction;
  deadline?: Deadline | null;
  cross_reference?: CrossRef | null;
  precedents?: Precedent[];
  legal_strategy?: string;
  draft_reply?: string;
  tools_called?: string[];
  agent_method?: string;
  error?: string;
};

const URGENCY_STYLE: Record<string, { bg: string; color: string }> = {
  OVERDUE: { bg: "rgba(220,38,38,0.10)", color: "#ef4444" },
  CRITICAL: { bg: "rgba(220,38,38,0.08)", color: "#ef4444" },
  HIGH: { bg: "rgba(234,179,8,0.08)", color: "#eab308" },
  MEDIUM: { bg: "rgba(234,179,8,0.06)", color: "#eab308" },
  NORMAL: { bg: "rgba(34,197,94,0.06)", color: "#22c55e" },
};

const TOOL_LABELS: Record<string, string> = {
  compute_response_deadline: "Computed statutory deadline",
  cross_ref_client_data: "Cross-referenced client ledger",
  search_gst_precedents: "Searched CBIC / AAR precedents",
  generate_legal_strategy: "Built legal strategy",
  draft_gst_reply: "Drafted the reply letter",
};

// Live agent pipeline shown during the ~2-minute run. The backend returns
// everything in one response (no streaming), so the stepper is timer-driven
// and holds on the final "Reply" step until the real result arrives.
const AGENT_STEPS = [
  { key: "extract",    label: "Extract",    log: "Google ADK Agent Initialized. Processing tax notice PDF..." },
  { key: "deadline",   label: "Deadline",   log: "Task compute_response_deadline: Calculating response window..." },
  { key: "ledger",     label: "Ledger",     log: "Task cross_ref_client_data: Querying local ledgers for questioned invoices..." },
  { key: "precedents", label: "Precedents", log: "Task search_gst_precedents: Provisioning serverless Vertex AI RAG Engine..." },
  { key: "strategy",   label: "Strategy",   log: "Task generate_legal_strategy: Gemini synthesizing tax precedents..." },
  { key: "reply",      label: "Reply",      log: "Task draft_gst_reply: Structuring ASMT-11 formal response..." },
];

export default function LitigationPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<AnalyseResult | null>(null);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [agentStep, setAgentStep] = useState(0); // # of completed pipeline steps
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasAccess(localStorage.getItem("regulance_early_access") === "true");
    }
    return () => {
      if (stepTimer.current) clearInterval(stepTimer.current);
    };
  }, []);

  const startStepper = () => {
    setAgentStep(1); // Extract begins immediately
    stepTimer.current = setInterval(() => {
      // Advance through tools but hold on the final "Reply" step (index 5)
      // until the real response arrives.
      setAgentStep((s) => (s < AGENT_STEPS.length - 1 ? s + 1 : s));
    }, 13000);
  };

  const stopStepper = () => {
    if (stepTimer.current) {
      clearInterval(stepTimer.current);
      stepTimer.current = null;
    }
    setAgentStep(0);
  };

  const handleGateSuccess = () => {
    setHasAccess(true);
    localStorage.setItem("regulance_early_access", "true");
    setGateOpen(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // First analysis is free; subsequent ones require early access.
    if (result && !hasAccess) {
      setGateOpen(true);
      e.target.value = "";
      return;
    }

    setUploading(true);
    setResult(null);
    setDraft("");
    startStepper();

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/litigation/demo/analyse`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
        setResult({ status: "ERROR", error: err.detail || "Analysis failed" });
      } else {
        const data: AnalyseResult = await res.json();
        if (data.status === "EXTRACTION_FAILED") {
          setResult({
            status: "ERROR",
            error:
              data.extraction?.error ||
              "Could not read this notice. Try a clearer PDF.",
          });
        } else {
          setResult(data);
          setDraft(data.draft_reply || "");
        }
      }
    } catch {
      setResult({ status: "ERROR", error: "Network error. Please try again." });
    }

    stopStepper();
    setUploading(false);
    e.target.value = "";
  };

  const copyDraft = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadDraft = () => {
    const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Reply_${result?.extraction?.gstin || "draft"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ex = result?.extraction || {};
  const claims = ex.claims || [];
  const cross = result?.cross_reference || {};
  const found = cross.found || [];
  const notFound = cross.not_found || [];
  const precedents = result?.precedents || [];
  const deadline = result?.deadline || null;
  const tools = result?.tools_called || [];
  const legalStrategy = result?.legal_strategy || "";

  const hasResult = result && !result.error;

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

        {/* Header */}
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
                  Live Demo · Google ADK + Vertex AI RAG Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-50">
                GST Litigation Agent
              </h1>
              <p className="mt-2 text-sm text-zinc-400 max-w-xl">
                Upload a GST scrutiny notice (ASMT-10, DRC-01). An autonomous
                agent extracts the department&apos;s claims, computes your filing
                deadline, searches CBIC &amp; AAR precedents, and drafts your
                reply — in under a minute.
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
            Upload GST Notice PDF
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
                style={{ borderColor: "#1a6d52", borderTopColor: "transparent" }}
              />
            ) : (
              <Upload className="h-5 w-5 text-zinc-600" />
            )}
            <span className="text-xs font-medium text-zinc-400">
              {uploading
                ? "Agent is reading the notice, researching, and drafting…"
                : "Drop or click to upload a GST notice PDF"}
            </span>
            <span className="text-[11px] text-zinc-600">
              {uploading
                ? "This can take up to ~2 minutes — the agent runs several reasoning steps."
                : "ASMT-10, DRC-01, or any GST scrutiny notice · Max 20 MB"}
            </span>
            <a
              href="/sample_asmt10_notice.pdf"
              download
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-[#1a6d52] hover:text-[#238c6a] underline underline-offset-2 transition-colors"
            >
              Download a sample notice
            </a>
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="hidden"
            />
          </label>

          {result?.error && (
            <div
              className="mt-3 p-3 rounded-lg text-xs"
              style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444" }}
            >
              {result.error}
            </div>
          )}
        </motion.div>

        {/* Live agent pipeline (during the run) */}
        {uploading && <AgentProgress step={agentStep} />}

        {/* Results */}
        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Disputed Amount"
                value={INR(ex.discrepancy_amount || 0)}
                color="#e4e4e7"
              />
              <StatCard
                label="Invoices Questioned"
                value={String((ex.questioned_invoice_numbers || []).length)}
                color="#e4e4e7"
              />
              <StatCard
                label="Confirmed in Records"
                value={String(found.length)}
                color="#22c55e"
              />
              <StatCard
                label="Not Found"
                value={String(notFound.length)}
                color="#eab308"
              />
            </div>

            {/* Deadline banner */}
            {deadline?.deadline_date && (
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={URGENCY_STYLE[deadline.urgency || "NORMAL"]}
              >
                <Clock className="h-4 w-4 shrink-0" />
                <p className="text-[13px] font-medium">
                  Response due by{" "}
                  <strong>{deadline.deadline_date}</strong>
                  {typeof deadline.days_remaining === "number" &&
                    ` — ${deadline.days_remaining} days remaining`}
                  {deadline.response_window && ` (${deadline.response_window} window)`}
                </p>
              </div>
            )}

            {/* Agent activity — the ADK pipeline */}
            {tools.length > 0 && (
              <div className="dark-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-[#1a6d52]" />
                  <p className="text-sm font-semibold text-zinc-200">
                    Agent activity
                  </p>
                  <span className="text-[10px] text-zinc-600 ml-auto">
                    {result?.agent_method === "adk_agent"
                      ? "Google ADK · autonomous tool-calling"
                      : "Sequential pipeline"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(tools)).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 text-[11px] text-zinc-300 rounded-full px-2.5 py-1"
                      style={{ background: "rgba(26,109,82,0.08)" }}
                    >
                      <Check className="h-3 w-3 text-[#1a6d52]" />
                      {TOOL_LABELS[t] || t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Legal Strategy — the agent's reasoning */}
            {legalStrategy && (
              <div className="dark-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-[#1a6d52]" />
                  <p className="text-sm font-semibold text-zinc-200">
                    AI Legal Strategy
                  </p>
                  <span className="text-[10px] text-zinc-600 ml-auto">
                    Synthesized by Gemini from notice claims, ledger evidence &amp; precedents
                  </span>
                </div>
                <div className="rounded-lg bg-[#0a0a0c] border border-[#1e1e22] p-4">
                  <p className="text-[13px] leading-relaxed text-zinc-300 whitespace-pre-wrap">
                    {legalStrategy}
                  </p>
                </div>
              </div>
            )}

            {/* Two-column: evidence + draft */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* LEFT */}
              <div className="space-y-4">
                {ex.summary && (
                  <div className="dark-card rounded-xl p-4">
                    <SectionLabel>Notice Summary</SectionLabel>
                    <p className="text-[13px] leading-relaxed text-zinc-300">
                      {ex.summary}
                    </p>
                  </div>
                )}

                {claims.length > 0 && (
                  <div className="dark-card rounded-xl p-4">
                    <SectionLabel>Department Claims ({claims.length})</SectionLabel>
                    <div className="space-y-2">
                      {claims.map((c, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg"
                          style={{ background: "rgba(220,38,38,0.06)" }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12px] leading-relaxed text-zinc-200">
                              {c.description}
                            </p>
                            <span className="text-[12px] font-bold shrink-0 tabular-nums text-zinc-100">
                              {INR(c.amount || 0)}
                            </span>
                          </div>
                          {c.section_reference && (
                            <p className="text-[11px] mt-1 font-mono text-zinc-500">
                              {c.section_reference}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cross-reference */}
                <div className="dark-card rounded-xl p-4">
                  <SectionLabel>Cross-Reference</SectionLabel>
                  {found.length === 0 && notFound.length === 0 ? (
                    <p className="text-[12px] leading-relaxed text-zinc-500">
                      In the full platform, questioned invoices are matched
                      against your Purchase Register automatically. Connect your
                      ledger to see confirmations here.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {found.map((f, i) => (
                        <InvoiceRow
                          key={`f${i}`}
                          inv={f.invoice_number}
                          status="found"
                          detail={f.vendor_name || "In records"}
                        />
                      ))}
                      {notFound.map((n, i) => (
                        <InvoiceRow
                          key={`n${i}`}
                          inv={n}
                          status="not_found"
                          detail="Not in records"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Precedents */}
                {precedents.length > 0 && (
                  <div className="dark-card rounded-xl p-4">
                    <SectionLabel>
                      Precedents &amp; Circulars ({precedents.length})
                    </SectionLabel>
                    <div className="space-y-2">
                      {precedents.map((p, i) => (
                        <a
                          key={i}
                          href={p.file_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2.5 p-2.5 rounded-lg transition-colors hover:bg-white/[0.02]"
                          style={{ background: "rgba(26,109,82,0.05)" }}
                        >
                          <BookOpen className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#1a6d52]" />
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-zinc-200 truncate">
                              {p.title || p.document_type || "Reference"}
                            </p>
                            {p.snippet && (
                              <p className="text-[11px] text-zinc-500 line-clamp-2">
                                {p.snippet}
                              </p>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: editable draft */}
              <div className="dark-card rounded-xl flex flex-col" style={{ minHeight: 520 }}>
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: "1px solid #1e1e22" }}
                >
                  <div className="flex items-center gap-2">
                    <Scale className="h-3.5 w-3.5 text-[#1a6d52]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-zinc-400">
                      Draft Reply
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyDraft}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-[#1a6d52]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={downloadDraft}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      .txt
                    </button>
                  </div>
                </div>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="flex-1 p-4 text-[13px] leading-relaxed resize-none focus:outline-none bg-transparent text-zinc-300"
                  placeholder="Agent-generated reply will appear here…"
                />
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <Button
                size="lg"
                onClick={() => (window.location.href = "/waitlist")}
                className="group"
              >
                Defend your notices with the full platform
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <p className="text-[11px] text-zinc-600">
                Full version cross-references your ledger and tracks every notice
                to filing.
              </p>
            </div>
          </motion.div>
        )}
      </Container>

      <EarlyAccessGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onSuccess={handleGateSuccess}
        title="Analyse more notices"
        subtitle="Sign up for early access to analyse unlimited notices, cross-reference your ledger, and track filings."
      />
    </main>
  );
}

function AgentProgress({ step }: { step: number }) {
  // step = number of completed steps; the step at index `step` is in progress.
  const visible = AGENT_STEPS.slice(0, Math.min(step + 1, AGENT_STEPS.length));
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="dark-card rounded-xl p-5 mb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-[#1a6d52]/10 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-[#1a6d52]" />
        </div>
        <div>
          <p className="text-base font-semibold text-zinc-100">
            Google ADK Autonomous Agent
          </p>
          <p className="text-[13px] text-zinc-500">
            Orchestrating GCP litigation tools…
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-start justify-between gap-1 mb-6">
        {AGENT_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={s.key}
              className="flex flex-col items-center gap-2 flex-1 relative"
            >
              {i < AGENT_STEPS.length - 1 && (
                <div
                  className="absolute top-[15px] left-1/2 w-full h-px"
                  style={{ background: done ? "#1a6d52" : "#1e1e22" }}
                />
              )}
              <div
                className="relative z-10 h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-semibold"
                style={{
                  background: done
                    ? "#1a6d52"
                    : active
                    ? "rgba(26,109,82,0.12)"
                    : "#141418",
                  border: `1px solid ${
                    done || active ? "rgba(26,109,82,0.5)" : "#1e1e22"
                  }`,
                  color: done ? "#fff" : active ? "#238c6a" : "#52525b",
                }}
              >
                {done ? (
                  <Check className="h-4 w-4" />
                ) : active ? (
                  <span className="animate-pulse">{i + 1}</span>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className="text-[11px]"
                style={{ color: done || active ? "#a1a1aa" : "#52525b" }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Terminal log */}
      <div className="rounded-lg bg-[#0a0a0c] border border-[#1e1e22] p-4 font-mono text-[12px] space-y-2.5">
        {visible.map((s) => (
          <p key={s.key} className="text-zinc-400 leading-relaxed">
            <span className="text-[#1a6d52]">&gt;</span> {s.log}
          </p>
        ))}
        <p className="text-zinc-600 flex items-center gap-2">
          <span className="text-[#1a6d52]">&gt;</span>
          <span className="inline-block h-3 w-3 rounded-full border-2 border-[#1a6d52] border-t-transparent animate-spin" />
          Agent thinking…
        </p>
      </div>
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-zinc-500 mb-2.5">
      {children}
    </p>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="dark-card rounded-xl px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-zinc-500">
        {label}
      </p>
      <p className="text-lg font-bold mt-0.5 tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function InvoiceRow({
  inv,
  status,
  detail,
}: {
  inv: string;
  status: "found" | "mismatch" | "not_found";
  detail: string;
}) {
  const config = {
    found: { Icon: CheckCircle2, color: "#22c55e", bg: "rgba(34,197,94,0.06)" },
    mismatch: { Icon: AlertTriangle, color: "#eab308", bg: "rgba(234,179,8,0.06)" },
    not_found: { Icon: XCircle, color: "#a1a1aa", bg: "rgba(161,161,170,0.06)" },
  }[status];
  const { Icon, color, bg } = config;
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
      style={{ background: bg }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
      <span className="text-[12px] font-mono font-semibold text-zinc-200">
        {inv}
      </span>
      <span className="text-[11px] ml-auto" style={{ color }}>
        {detail}
      </span>
    </div>
  );
}
