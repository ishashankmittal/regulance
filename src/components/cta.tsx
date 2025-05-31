"use client";

import { Container } from "./ui/container";
import { Button } from "./ui/button";

export function CTA() {
  return (
    <section id="cta" className="cta-gradient">
      <Container className="py-16 sm:py-24">
        <div className="cta-content mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Make compliance invisible for your business
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
            Join the growing number of Indian startups and SMEs using Regulance to navigate
            complex regulatory requirements with confidence and efficiency.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90"
              onClick={() => window.location.href = "https://forms.office.com/r/10FbcPgeS7?origin=lprLink"}
            >
              Join waitlist
            </Button>
            <Button
              variant="outline"
              size="lg" 
              className="border-white text-white hover:bg-primary-foreground/10"
              onClick={() => window.location.href = "/contact"}
            >
              Schedule demo
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
} 