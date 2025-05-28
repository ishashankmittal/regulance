"use client";

import { Container } from "./ui/container";
import { Button } from "./ui/button";

export function CTA() {
  return (
    <section className="bg-primary">
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to simplify compliance?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
            Join hundreds of Indian businesses already using Regulance to navigate
            the complex world of regulatory compliance with confidence.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => window.location.href = "/register"}
            >
              Get started for free
            </Button>
            <Button
              variant="outline"
              size="lg" 
              className="border-white text-white hover:bg-primary-foreground/10"
              onClick={() => window.location.href = "/contact"}
            >
              Contact sales
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
} 