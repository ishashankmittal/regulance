"use client";

import { Container } from "./ui/container";
import { Database, MessageSquare, Shield } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Native ERP Blocking.",
    description:
      "Don't just flag errors. Push compliance holds directly to Tally Prime, Zoho Books, and Marg ERP ledgers. Risky payments get frozen before they leave the account.",
    icon: Database,
    tag: "ERP SYNC",
    visual: (
      <div className="mt-6 space-y-2.5 text-xs font-mono">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0a0a0c] border border-[#1e1e22]">
          <span className="text-zinc-500">Vendor A — Compliant</span>
          <span className="text-[#1a6d52] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a6d52]" />
            Synced to Tally
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0a0a0c] border border-[#1a6d52]/20">
          <span className="text-zinc-500">Vendor B — GSTIN Mismatch</span>
          <span className="text-zinc-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            Payment Blocked
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0a0a0c] border border-[#1e1e22]">
          <span className="text-zinc-500">Vendor C — Compliant</span>
          <span className="text-[#1a6d52] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a6d52]" />
            Synced to Tally
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Zero-Touch Recovery.",
    description:
      "AI agents parse missing invoices and autonomously chase defaulting vendors via WhatsApp Business APIs. You set the policy. Regulance enforces it.",
    icon: MessageSquare,
    tag: "AUTO-CHASE",
    visual: (
      <div className="mt-6 space-y-3 text-xs">
        <div className="bg-[#0a0a0c] border border-[#1e1e22] rounded-lg p-3">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <span className="w-4 h-4 rounded-full bg-[#1a6d52] flex items-center justify-center text-[10px] text-white font-bold">
              R
            </span>
            Regulance Bot
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Your invoice is missing from the vendor&apos;s GSTR-1 filing.
            Please upload the revised return or confirm the correct
            invoice reference.
          </p>
        </div>
        <div className="bg-[#0a0a0c] border border-[#1e1e22] rounded-lg p-3">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <span className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] text-white font-bold">
              V
            </span>
            Vendor Reply
          </div>
          <p className="text-zinc-500 leading-relaxed">
            Revised GSTR-1 filed. Updated invoice reference shared.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "GST Litigation Agent.",
    description:
      "Upload an ASMT-10 notice. An autonomous agent built on Google's Agent Development Kit reads the claims, searches CBIC circulars and AAR rulings through Vertex AI RAG Engine, cross-references your ledger, and drafts the reply in minutes.",
    icon: Shield,
    tag: "GOOGLE ADK · RAG ENGINE",
    visual: (
      <div className="mt-6 bg-[#0a0a0c] border border-[#1e1e22] rounded-lg p-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-500 mb-3">
          <Shield className="h-3.5 w-3.5 text-[#1a6d52]" />
          <span>asmt-11_reply.pdf — Generated</span>
        </div>
        <div className="space-y-1.5 text-zinc-500">
          <p>
            <span className="text-zinc-700">01</span> &nbsp;Agent reads notice —
            ASMT-10 claims extracted
          </p>
          <p>
            <span className="text-zinc-700">02</span> &nbsp;Computes statutory
            response deadline
          </p>
          <p>
            <span className="text-zinc-700">03</span> &nbsp;Cross-references your
            ledger for each invoice
          </p>
          <p>
            <span className="text-zinc-700">04</span> &nbsp;Searches precedents
            via Vertex AI RAG Engine
          </p>
          <p>
            <span className="text-zinc-700">05</span>{" "}
            &nbsp;Drafts reply:{" "}
            <span className="text-[#1a6d52]">CBIC circular &amp; AAR ruling cited</span>
          </p>
        </div>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="system" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px brand-line opacity-20" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-mono text-[#1a6d52] tracking-widest uppercase mb-4">
            System of Action
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
            Not another dashboard.
            <br />
            <span className="text-zinc-500">An autonomous workforce.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="dark-card rounded-2xl p-6 lg:p-7 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
                    {card.tag}
                  </span>
                  <card.icon className="h-4 w-4 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {card.description}
                </p>
                {card.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
