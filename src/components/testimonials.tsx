import { Container } from "./ui/container";

const testimonials = [
  {
    content:
      "Regulance has transformed how we handle compliance. The AI monitoring is incredibly accurate, and we're saving dozens of hours each month by not having to manually track regulatory changes.",
    author: {
      name: "Vikram Sharma",
      role: "CFO at TechStart India",
    },
  },
  {
    content:
      "As a growing startup, keeping up with compliance was overwhelming. Regulance simplifies everything with clear guidance and proactive alerts. It's like having a compliance expert on staff 24/7.",
    author: {
      name: "Priya Mehta",
      role: "Founder & CEO at GreenLift",
    },
  },
  {
    content:
      "The collaboration features have streamlined our workflows with our legal team. We can quickly discuss implications of new regulations and assign tasks all within the platform.",
    author: {
      name: "Arun Patel",
      role: "Operations Director at FinEdge",
    },
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <Container>
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold text-primary">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by leading Indian businesses
          </p>
          <p className="mt-6 text-lg text-muted-foreground">
            See how Regulance is helping companies across India simplify 
            compliance and focus on growth.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl bg-secondary p-8 shadow-sm ring-1 ring-border"
            >
              <div>
                <p className="text-lg font-medium leading-8">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="mt-6 flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.author.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
} 