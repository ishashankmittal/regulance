import Link from "next/link";
import { Container } from "./ui/container";

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e22]/50 py-8">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-zinc-400 tracking-wide uppercase">
              Regulance
            </span>
            <span className="text-xs text-zinc-700">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://www.linkedin.com/company/regulance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              LinkedIn
            </Link>
            <Link
              href="mailto:shashank.kumar@regulance.co.in"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              shashank.kumar@regulance.co.in
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
