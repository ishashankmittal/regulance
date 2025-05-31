import { Container } from "./ui/container";
import { Brain, Shield, Clock, Users, FileText, Zap } from "lucide-react";

const features = [
  {
    name: "Agentic AI Monitoring",
    description:
      "Intelligent agents continuously monitor and interpret MCA, GST, RBI, SEBI, and DPDP regulatory updates that matter specifically to your business.",
    icon: Brain,
  },
  {
    name: "Proactive Compliance Management",
    description:
      "Our system identifies compliance requirements before deadlines, providing alerts and guided workflows to keep you ahead of regulatory changes.",
    icon: Shield,
  },
  {
    name: "Real-time Regulatory Intelligence",
    description:
      "Stay informed with contextual, business-specific notifications about new regulations and compliance obligations when they happen.",
    icon: Clock,
  },
  {
    name: "Seamless Team Collaboration",
    description:
      "Connect your legal, CA, and CS teams within the platform, eliminating fragmented workflows and WhatsApp coordination.",
    icon: Users,
  },
  {
    name: "Standardized Legal Guidance",
    description:
      "Receive clear, actionable guidance grounded in current Indian law, customized to your specific business requirements.",
    icon: FileText,
  },
  {
    name: "Invisible Compliance Layer",
    description:
      "We are building the compliance infrastructure that works behind the scenes, letting you focus on growing your business rather than paperwork.",
    icon: Zap,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-mesh"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold text-primary">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for regulatory compliance
          </p>
          <p className="mt-6 text-lg text-muted-foreground">
            Regulance tackles the complexity of Indian regulatory requirements with 
            AI-powered agents and streamlined workflows designed specifically for startups and SMEs.
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