"use client";

import { Container } from "./ui/container";
import { motion } from "framer-motion";

const flows: {
  x1: number; y1: number; x2: number; y2: number;
  label: string; bright?: boolean; delay: number;
}[] = [
  { x1: 130, y1: 90, x2: 215, y2: 215, label: "Sync ledgers", delay: 0 },
  { x1: 215, y1: 245, x2: 130, y2: 410, label: "Block payments", bright: true, delay: 0.4 },
  { x1: 390, y1: 90, x2: 305, y2: 215, label: "Fetch GSTR-2B", delay: 0.8 },
  { x1: 305, y1: 245, x2: 390, y2: 410, label: "Route approvals", delay: 1.2 },
  { x1: 235, y1: 280, x2: 130, y2: 420, label: "Chase vendors", bright: true, delay: 1.6 },
  { x1: 170, y1: 460, x2: 260, y2: 290, label: "Vendor responds", delay: 2.0 },
  { x1: 180, y1: 470, x2: 340, y2: 470, label: "Escalate if no reply", delay: 2.4 },
  { x1: 420, y1: 100, x2: 420, y2: 410, label: "Flag mismatch", bright: true, delay: 2.8 },
];

function FlowDiagram() {
  return (
    <div className="relative w-full max-w-lg mx-auto" style={{ aspectRatio: "1/1" }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 520 520"
        fill="none"
      >
        {flows.map((flow, i) => {
          const midX = (flow.x1 + flow.x2) / 2;
          const midY = (flow.y1 + flow.y2) / 2;
          const pathId = `os-flow-${i}`;
          const lineColor = flow.bright ? "#1a6d52" : "#2a2a2e";
          const lineOpacity = flow.bright ? 0.6 : 0.5;
          const dotColor = flow.bright ? "#238c6a" : "#3a3a3e";

          return (
            <g key={i}>
              <line
                x1={flow.x1} y1={flow.y1} x2={flow.x2} y2={flow.y2}
                stroke={lineColor}
                strokeWidth={flow.bright ? 1.5 : 1}
                strokeDasharray="6 4"
                opacity={lineOpacity}
                className="edge-flow"
                style={{ animationDelay: `${flow.delay}s` }}
              />
              <path
                id={pathId}
                d={`M${flow.x1},${flow.y1} L${flow.x2},${flow.y2}`}
                stroke="none" fill="none"
              />
              <circle r="3" fill={dotColor} opacity="0.9">
                <animateMotion
                  dur={`${3 + i * 0.3}s`}
                  begin={`${flow.delay}s`}
                  repeatCount="indefinite"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
              <rect
                x={midX - flow.label.length * 3.2}
                y={midY - 18}
                width={flow.label.length * 6.4}
                height={14}
                rx="4"
                fill="#0a0a0c"
                opacity="0.9"
              />
              <text
                x={midX} y={midY - 8}
                textAnchor="middle"
                fill={flow.bright ? "#238c6a" : "#52525b"}
                fontSize="9"
                fontFamily="var(--font-mono)"
              >
                {flow.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Top-left: Tally / ERP */}
      <div className="absolute top-4 left-2 sm:left-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#0e0e12] border border-[#1e1e22] rounded-xl px-3 sm:px-4 py-2.5 text-center"
        >
          <div className="text-[9px] font-mono text-zinc-600 tracking-wider uppercase mb-0.5">Integration</div>
          <div className="text-xs sm:text-sm font-medium text-zinc-300">Tally / ERP</div>
          <div className="mt-1.5 flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#1a6d52]" />
            <span className="text-[9px] text-zinc-600 font-mono">Connected</span>
          </div>
        </motion.div>
      </div>

      {/* Top-right: GST Portal */}
      <div className="absolute top-4 right-2 sm:right-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-[#0e0e12] border border-[#1e1e22] rounded-xl px-3 sm:px-4 py-2.5 text-center"
        >
          <div className="text-[9px] font-mono text-zinc-600 tracking-wider uppercase mb-0.5">Data Source</div>
          <div className="text-xs sm:text-sm font-medium text-zinc-300">GST Portal</div>
          <div className="mt-1.5 flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#1a6d52]" />
            <span className="text-[9px] text-zinc-600 font-mono">Syncing</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom-left: WhatsApp */}
      <div className="absolute bottom-4 left-2 sm:left-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-[#0e0e12] border border-[#1e1e22] rounded-xl px-3 sm:px-4 py-2.5 text-center"
        >
          <div className="text-[9px] font-mono text-zinc-600 tracking-wider uppercase mb-0.5">Outbound</div>
          <div className="text-xs sm:text-sm font-medium text-zinc-300">WhatsApp API</div>
          <div className="mt-1.5 flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#238c6a] animate-pulse" />
            <span className="text-[9px] text-zinc-600 font-mono">Chasing</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom-right: Partner Queue */}
      <div className="absolute bottom-4 right-2 sm:right-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="bg-[#0e0e12] border border-[#1e1e22] rounded-xl px-3 sm:px-4 py-2.5 text-center"
        >
          <div className="text-[9px] font-mono text-zinc-600 tracking-wider uppercase mb-0.5">Workflow</div>
          <div className="text-xs sm:text-sm font-medium text-zinc-300">Partner Queue</div>
          <div className="mt-1.5 flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="text-[9px] text-zinc-600 font-mono">Pending</span>
          </div>
        </motion.div>
      </div>

      {/* Central Hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10"
        >
          <div className="absolute -inset-6 rounded-2xl bg-[#1a6d52]/[0.06] blur-2xl pointer-events-none" />
          <div className="absolute -inset-1 rounded-2xl border border-[#1a6d52]/15 pointer-events-none" />

          <div
            className="relative bg-[#0e0e12] border border-[#1a6d52]/25 rounded-2xl px-6 sm:px-8 py-5 sm:py-6 text-center"
            style={{
              boxShadow: "0 0 40px rgba(26, 109, 82, 0.12), 0 0 80px rgba(26, 109, 82, 0.04)",
            }}
          >
            <div className="text-[10px] font-mono text-[#1a6d52] tracking-widest uppercase mb-1.5">
              Core Engine
            </div>
            <div className="text-lg font-bold text-zinc-100">Regulance OS</div>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a6d52] animate-pulse" />
              <span className="text-[11px] text-[#1a6d52] font-mono">Active</span>
            </div>
            <div className="mt-3 text-[10px] text-zinc-600 font-mono max-w-[160px] leading-relaxed">
              Reconcile → Flag → Block → Chase → Resolve
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function ComplianceOS() {
  return (
    <section id="moat" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px brand-line opacity-20" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-mono text-[#1a6d52] tracking-widest uppercase mb-4">
              The Infrastructure
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50 leading-tight">
              The Operating System for
              <br />
              Preventative Compliance.
            </h2>
            <p className="mt-6 text-base text-zinc-400 leading-relaxed max-w-lg">
              Regulance isn&apos;t a tool you use after a mistake is made;
              it&apos;s the infrastructure that prevents it. By embedding directly
              into your ERPs and daily workflows, our OS acts as a real-time
              financial guardrail—blocking risky payments and catching MSME
              penalties before the money ever leaves the account.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Embeds directly into Tally, Zoho, and Marg ERP",
                "Real-time payment holds on non-compliant vendors",
                "Section 43B(h) MSME deadline enforcement",
                "Automated vendor communication via WhatsApp",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1a6d52] flex-shrink-0" />
                  <span className="text-sm text-zinc-400">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FlowDiagram />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
