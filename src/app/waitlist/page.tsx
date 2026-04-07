"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type FormData = {
  name: string;
  email: string;
  firmName: string;
  role: string;
  clientCount: string;
  message: string;
};

const roleOptions = [
  "Chartered Accountant",
  "CA Firm Partner",
  "Tax Consultant",
  "CFO / Finance Head",
  "Accountant",
  "Other",
];

const clientCountOptions = [
  "1–10",
  "11–50",
  "51–200",
  "200+",
];

export default function WaitlistPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    firmName: "",
    role: "",
    clientCount: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      if (!db) {
        throw new Error("Firebase not configured");
      }
      await addDoc(collection(db, "waitlist"), {
        ...form,
        submittedAt: serverTimestamp(),
      });
      setStatus("success");
    } catch (err) {
      console.error("Waitlist submission error:", err);
      setErrorMsg(
        "Something went wrong. Please email us at shashank.kumar@regulance.co.in instead."
      );
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full bg-[#0e0e12] border border-[#1e1e22] rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#1a6d52]/40 focus:border-[#1a6d52]/40 transition-all";

  const labelClasses = "block text-sm font-medium text-zinc-300 mb-2";

  return (
    <main className="min-h-screen bg-[#0a0a0c] relative">
      <div className="grid-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#1a6d52]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10 py-12 lg:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-12"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <Image
                src="/regulance.png"
                alt="Regulance"
                width={28}
                height={28}
                className="rounded"
              />
              <span className="text-sm font-semibold text-zinc-200 tracking-wide uppercase">
                Regulance
              </span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
              Get Early Access
            </h1>
            <p className="mt-3 text-base text-zinc-400 max-w-md mx-auto">
              We&apos;re onboarding CA firms in batches. Fill this out and
              we&apos;ll reach out within 48 hours.
            </p>
          </motion.div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-[#1a6d52]/10 border border-[#1a6d52]/20 flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-[#1a6d52]" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-50 mb-3">
                You&apos;re on the list.
              </h2>
              <p className="text-base text-zinc-400 max-w-sm mx-auto mb-8">
                We&apos;ll be in touch soon. In the meantime, feel free to
                reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="ghost" onClick={() => (window.location.href = "/")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    (window.location.href = "mailto:shashank.kumar@regulance.co.in")
                  }
                >
                  shashank.kumar@regulance.co.in
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className={labelClasses}>
                    Name <span className="text-zinc-600">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Work Email <span className="text-zinc-600">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@firm.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="firmName" className={labelClasses}>
                  Firm / Company Name
                </label>
                <input
                  id="firmName"
                  name="firmName"
                  type="text"
                  placeholder="Your firm or company"
                  value={form.firmName}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className={labelClasses}>
                    Your Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none`}
                  >
                    <option value="" className="bg-[#0e0e12] text-zinc-500">
                      Select your role
                    </option>
                    {roleOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0e0e12] text-zinc-200">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="clientCount" className={labelClasses}>
                    Number of Clients
                  </label>
                  <select
                    id="clientCount"
                    name="clientCount"
                    value={form.clientCount}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none`}
                  >
                    <option value="" className="bg-[#0e0e12] text-zinc-500">
                      Select range
                    </option>
                    {clientCountOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0e0e12] text-zinc-200">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className={labelClasses}>
                  Anything else?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="What compliance problems are costing you the most time?"
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              {status === "error" && (
                <div className="text-sm text-red-400 bg-red-400/5 border border-red-400/10 rounded-lg px-4 py-3">
                  {errorMsg}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={status === "submitting"}
                className="w-full group"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get Early Access
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-zinc-600 text-center">
                Only name and email are required. We&apos;ll never spam you.
              </p>
            </motion.form>
          )}
        </div>
      </Container>
    </main>
  );
}
