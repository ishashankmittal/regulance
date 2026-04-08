# Regulance - Making Regulatory Compliance Invisible

This repository contains the landing page for Regulance, an AI-powered regulatory compliance platform for Indian startups and businesses. The website is built using Next.js and showcases Regulance mission to provide intelligent Agentic AI systems that monitor, interpret, and summarize updates from MCA, RBI, SEBI, GST, and other authorities.

![Regulance Logo](public/regulance.png)


## About Regulance

Regulance is building the compliance layer of India with an agent-first approach that makes regulatory compliance invisible for startups and SMEs. Our platform helps businesses stay ahead of regulatory changes with:

- **Agentic AI Monitoring** - Intelligent agents continuously monitor and interpret regulatory updates that matter to your business
- **Proactive Compliance Management** - Identify compliance requirements before deadlines
- **Real-time Regulatory Intelligence** - Get contextual, business-specific notifications about new regulations
- **Seamless Team Collaboration** - Connect legal, CA, and CS teams within the platform

## Development

This website is built with [Next.js](https://nextjs.org/) and uses modern web technologies to provide an elegant user experience.

### Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Technologies Used

- **Next.js** - React framework for building the website
- **Tailwind CSS** - For styling and responsive design
- **TypeScript** - For type-safe code

## Deployment

This project deploys through GitHub Actions using the Vercel CLI so every pushed commit can deploy, regardless of commit author.

### One-Time Setup

1. In Vercel, disable Git-based auto deployments for this project (or disconnect the Git integration) to avoid duplicate or blocked deployments.
2. In your GitHub repository, add these Actions secrets:
   - `VERCEL_TOKEN`: Personal token from your Vercel account that has access to this project.
   - `VERCEL_ORG_ID`: Your Vercel team or personal account ID.
   - `VERCEL_PROJECT_ID`: The Vercel project ID.
3. Ensure the workflow file exists at `.github/workflows/vercel-deploy.yml`.

You can get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from Vercel project settings, or by running `vercel link` locally and reading `.vercel/project.json`.

### Deployment Behavior

- Every push triggers the workflow.
- Pushes to the repository default branch deploy to Production.
- Pushes to all other branches deploy Preview builds.

## Connect with Regulance

- [LinkedIn](https://www.linkedin.com/company/regulance/)
- [Website](https://www.regulance.com)
