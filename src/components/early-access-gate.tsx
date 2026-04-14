"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type FormData = {
  name: string;
  email: string;
  firmName: string;
  role: string;
  source: string;
};

const roleOptions = [
  "Chartered Accountant",
  "CA Firm Partner",
  "Tax Consultant",
  "CFO / Finance Head",
  "Accountant",
  "Other",
];

interface EarlyAccessGateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export function EarlyAccessGate({
  open,
  onClose,
  onSuccess,
  title = "Get Full Access",
  subtitle = "Sign up for early access to export reports, save results, and upload more files.",
}: EarlyAccessGateProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    firmName: "",
    role: "",
    source: "msme-tracker-demo",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      if (!db) throw new Error("Firebase not configured");
      await addDoc(collection(db, "waitlist"), {
        ...form,
        submittedAt: serverTimestamp(),
      });
      setStatus("success");
      setTimeout(() => onSuccess(), 2000);
    } catch {
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
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25 }}
            className="relative bg-[#0a0a0c] border border-[#1e1e22] rounded-xl w-full max-w-lg p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#1a6d52]/10 border border-[#1a6d52]/20 flex items-center justify-center mx-auto mb-5">
                  <Check className="h-7 w-7 text-[#1a6d52]" />
                </div>
                <h2 className="text-xl font-bold text-zinc-50 mb-2">
                  You&apos;re on the list!
                </h2>
                <p className="text-sm text-zinc-400">
                  We&apos;ll be in touch within 48 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 mb-4"
                  >
                    <Image
                      src="/regulance.png"
                      alt="Regulance"
                      width={24}
                      height={24}
                      className="rounded"
                    />
                    <span className="text-sm font-semibold text-zinc-200 tracking-wide uppercase">
                      Regulance
                    </span>
                  </Link>
                  <h2 className="text-xl font-bold text-zinc-50">{title}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="gate-name" className={labelClasses}>
                        Name <span className="text-zinc-600">*</span>
                      </label>
                      <input
                        id="gate-name"
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
                      <label htmlFor="gate-email" className={labelClasses}>
                        Work Email <span className="text-zinc-600">*</span>
                      </label>
                      <input
                        id="gate-email"
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
                    <label htmlFor="gate-firm" className={labelClasses}>
                      Firm / Company Name
                    </label>
                    <input
                      id="gate-firm"
                      name="firmName"
                      type="text"
                      placeholder="Your firm or company"
                      value={form.firmName}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label htmlFor="gate-role" className={labelClasses}>
                      Your Role
                    </label>
                    <select
                      id="gate-role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className={`${inputClasses} appearance-none`}
                    >
                      <option value="" className="bg-[#0e0e12] text-zinc-500">
                        Select your role
                      </option>
                      {roleOptions.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          className="bg-[#0e0e12] text-zinc-200"
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
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
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
