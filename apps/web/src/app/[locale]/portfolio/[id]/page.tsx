import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLandingMessages } from "@/app/[locale]/lib/messages";
import type { Portfolio, Project } from "@/app/[locale]/types/portfolio";

interface PortfolioPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: PortfolioPageProps) {
  const { locale, id } = await params;
  const messages = await getLandingMessages(locale);
  const portfolio = messages.portfolio as Portfolio;

  const projectSlug = decodeURIComponent(id);
  const project = portfolio.projects.find(
    (p: Project) => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug,
  );

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} | Portfolio`,
    description: project.description,
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioPageProps) {
  const { locale, id } = await params;
  const messages = await getLandingMessages(locale);
  const portfolio = messages.portfolio as Portfolio;

  const projectSlug = decodeURIComponent(id);
  const project = portfolio.projects.find(
    (p: Project) => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug,
  );

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-b border-border/40">
        <div className="container py-8">
          <Link href={`/${locale}#portfolio`}>
            <Button variant="ghost" className="group">
              <ArrowLeftIcon className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
              {portfolio.projectPage.backToPortfolio}
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero section with image */}
      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - Image */}
          <div className="relative overflow-hidden rounded-3xl border border-border/40 shadow-xl">
            <Image
              src={project.image}
              alt={project.alt}
              width={800}
              height={600}
              className="size-full object-cover"
              priority
            />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-6">
              <Badge variant="outline" className="bg-card/80 text-xs uppercase tracking-[0.2em]">
                {project.industry}
              </Badge>
              <span className="rounded-full bg-card/80 px-3 py-1 text-sm font-medium text-muted-foreground">
                {project.year}
              </span>
            </div>
          </div>

          {/* Right column - Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{project.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{project.tagline}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{portfolio.projectPage.technologies}</h2>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-base leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Key highlights section */}
        <div className="mt-16">
          <h2 className="mb-8 text-3xl font-bold">{portfolio.projectPage.keyHighlights}</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.highlights.map((highlight, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-sm leading-relaxed text-muted-foreground">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA section */}
        <div className="mt-16 rounded-3xl border border-border/40 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 p-12 text-center shadow-sm">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {portfolio.projectPage.interestedInSimilar}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {portfolio.projectPage.ctaDescription}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600">
              <Link href={`/${locale}#contact`}>{portfolio.projectPage.contactUs}</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href={`/${locale}#portfolio`}>{portfolio.projectPage.viewMoreProjects}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
