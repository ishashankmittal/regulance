import { Container } from "./ui/container";
import { Brain, Shield, Clock, Users, FileText, Zap } from "lucide-react";

const features = [
  {
    name: "AI-Powered Monitoring",
    description:
      "Intelligent agents continuously monitor regulatory updates from MCA, RBI, SEBI, GST, and other authorities.",
    icon: Brain,
  },
  {
    name: "Simplified Compliance",
    description:
      "Track filings, deadlines, and regulatory requirements in one centralized platform.",
    icon: Shield,
  },
  {
    name: "Real-time Updates",
    description:
      "Stay informed about regulatory changes with real-time notifications and alerts.",
    icon: Clock,
  },
  {
    name: "Team Collaboration",
    description:
      "Seamlessly collaborate with legal, CA, and CS teams within the platform.",
    icon: Users,
  },
  {
    name: "Standardized Guidance",
    description:
      "Receive clear, actionable guidance grounded in current Indian law.",
    icon: FileText,
  },
  {
    name: "Proactive Compliance",
    description:
      "Identify and address compliance issues before they become problems.",
    icon: Zap,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-secondary"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold text-primary">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for regulatory compliance
          </p>
          <p className="mt-6 text-lg text-muted-foreground">
            Regulance simplifies the complex world of Indian regulatory compliance 
            with intelligent AI tools and streamlined workflows.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <feature.icon
                    className="h-5 w-5 flex-none text-primary"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
} 