"use client";

import { Container } from "./ui/container";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section id="cta" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px brand-line opacity-20" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-50">
            Stop bleeding credits.
          </h2>
          <p className="mt-5 text-base text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Every quarter, Indian businesses write off lakhs in unrecovered ITC
            because reconciliation happens too late. Regulance fixes that.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
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
              shashank.kumar@regulance.co.in
            </Button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={() => (window.location.href = "/msme-tracker")}
              className="group inline-flex flex-col items-center gap-0.5 cursor-pointer bg-transparent border-none"
            >
              <span className="text-sm font-medium text-[#1a6d52] group-hover:text-[#238c6a] transition-colors flex items-center gap-1.5">
                Try Section 43B(h) Tracker
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-[10px] text-zinc-600">
                No login required
              </span>
            </button>
            <p className="text-xs text-zinc-600">
              Currently onboarding CA firms managing 50+ clients.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
