"use client";

import { Container } from "./ui/container";
import { Button } from "./ui/button";
import {
  ArrowRight,
  Database,
  Globe,
  SearchCheck,
  AlertTriangle,
  MessageSquare,
  ShieldBan,
  FileCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const auditSteps = [
  {
    icon: Database,
    label: "Tally Sync",
    description: "Pull ledger data",
    status: "done" as const,
  },
  {
    icon: Globe,
    label: "Portal Fetch",
    description: "GSTR-2B / 26AS",
    status: "done" as const,
  },
  {
    icon: SearchCheck,
    label: "Reconcile",
    description: "Cross-reference records",
    status: "done" as const,
  },
  {
    icon: AlertTriangle,
    label: "Flag",
    description: "Mismatches detected",
    status: "flagged" as const,
  },
  {
    icon: MessageSquare,
    label: "Chase",
    description: "WhatsApp vendor follow-up",
    status: "active" as const,
  },
  {
    icon: ShieldBan,
    label: "Block",
    description: "Payment hold in ERP",
    status: "active" as const,
  },
  {
    icon: FileCheck,
    label: "Report",
    description: "PDF audit exported",
    status: "pending" as const,
  },
];

// Single palette — only brand teal + zinc neutrals
const statusStyles = {
  done: {
    dot: "bg-[#1a6d52]",
    border: "border-[#1a6d52]/20",
    bg: "bg-[#1a6d52]/5",
    icon: "text-[#1a6d52]",
    connector: "#1a6d52",
  },
  flagged: {
    dot: "bg-[#1a6d52]",
    border: "border-[#1a6d52]/30",
    bg: "bg-[#1a6d52]/8",
    icon: "text-[#238c6a]",
    connector: "#1a6d52",
  },
  active: {
    dot: "bg-[#238c6a] animate-pulse",
    border: "border-[#1a6d52]/25",
    bg: "bg-[#1a6d52]/5",
    icon: "text-[#238c6a]",
    connector: "#1a6d52",
  },
  pending: {
    dot: "bg-zinc-700",
    border: "border-[#1e1e22]",
    bg: "bg-[#141418]/50",
    icon: "text-zinc-600",
    connector: "#1e1e22",
  },
};

function AuditFlowDiagram() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="bg-[#0e0e12] border border-[#1e1e22] rounded-xl overflow-hidden brand-glow-sm">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e22]">
          <div className="w-3 h-3 rounded-full bg-[#1e1e22]" />
          <div className="w-3 h-3 rounded-full bg-[#1e1e22]" />
          <div className="w-3 h-3 rounded-full bg-[#1e1e22]" />
          <span className="ml-3 text-xs text-zinc-600 font-mono">
            regulance — audit session
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a6d52] animate-pulse" />
            <span className="text-[10px] text-[#1a6d52] font-mono">Running</span>
          </div>
        </div>

        {/* Flow */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-stretch gap-0">
            {auditSteps.map((step, i) => {
              const style = statusStyles[step.status];
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  className="flex sm:flex-col items-center gap-3 sm:gap-0 flex-1 relative"
                >
                  {/* Connector */}
                  {i < auditSteps.length - 1 && (
                    <>
                      <div className="hidden sm:block absolute top-[28px] left-[calc(50%+20px)] right-[-50%] h-px z-0">
                        <div
                          className="h-full w-full"
                          style={{ background: style.connector, opacity: 0.3 }}
                        />
                        {step.status !== "pending" && (
                          <motion.div
                            className="absolute top-[-2px] w-1.5 h-1.5 rounded-full bg-[#1a6d52]"
                            animate={{ left: ["0%", "100%"] }}
                            transition={{
                              duration: 2.5 + i * 0.2,
                              delay: 1.2 + i * 0.3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        )}
                      </div>
                      <div className="sm:hidden absolute left-[20px] top-[44px] bottom-[-12px] w-px z-0">
                        <div
                          className="h-full w-full"
                          style={{ background: style.connector, opacity: 0.3 }}
                        />
                      </div>
                    </>
                  )}

                  {/* Node */}
                  <div className="relative z-10 flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 w-full">
                    <div
                      className={`relative flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl ${style.bg} ${style.border} border flex items-center justify-center`}
                    >
                      <step.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${style.icon}`} />
                      <span
                        className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${style.dot} border-2 border-[#0e0e12]`}
                      />
                    </div>

                    <div className="sm:mt-3 min-w-0">
                      <div className="text-xs font-semibold text-zinc-300 truncate">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-zinc-600 font-mono mt-0.5 leading-tight">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {i < auditSteps.length - 1 && <div className="sm:hidden h-4" />}
                </motion.div>
              );
            })}
          </div>

          {/* Status bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.6 }}
            className="mt-8 pt-5 border-t border-[#1e1e22] flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-[#1a6d52]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a6d52]" />
                4 completed
              </span>
              <span className="flex items-center gap-1.5 text-[#238c6a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#238c6a] animate-pulse" />
                2 in progress
              </span>
              <span className="flex items-center gap-1.5 text-zinc-600">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                1 queued
              </span>
            </div>
            <span className="text-[11px] text-zinc-600 font-mono">
              End-to-end automated pipeline
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-14">
      <div className="grid-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#1a6d52]/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-50"
          >
            The Automated Financial
            <br />
            <span className="text-[#1a6d52]">Immune System</span> for India.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Regulance bridges the gap between Tally and the GST portal. We empower
            CA firms with an AI workforce that autonomously audits ledgers, resolves
            discrepancies, and defends against government scrutiny notices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              size="lg"
              onClick={() => (window.location.href = "/waitlist")}
              className="group"
            >
              Get Early Access
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() =>
                (window.location.href = "mailto:shashank.kumar@regulance.co.in")
              }
            >
              Talk to Founders
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20"
        >
          <AuditFlowDiagram />
        </motion.div>
      </Container>
    </section>
  );
}
