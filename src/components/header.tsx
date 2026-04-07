"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "./ui/container";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navigation = [
  { name: "System", href: "#system" },
  { name: "Infrastructure", href: "#moat" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-[#1e1e22]/50"
          : "bg-transparent"
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
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

          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                (window.location.href = "mailto:shashank.kumar@regulance.co.in")
              }
            >
              Talk to Founders
            </Button>
            <Button
              size="sm"
              onClick={() => (window.location.href = "/waitlist")}
            >
              Get Early Access
            </Button>
          </div>

          <button
            className="md:hidden text-zinc-500 hover:text-zinc-200 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </Container>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-[#1e1e22]/50">
          <Container className="py-4">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-zinc-500 hover:text-zinc-200 px-3 py-2.5 rounded-lg hover:bg-[#141418] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-[#1e1e22] flex flex-col gap-2">
                <Button className="w-full" size="sm" onClick={() => (window.location.href = "/waitlist")}>
                  Get Early Access
                </Button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
