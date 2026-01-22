export interface Project {
  name: string;
  industry: string;
  category: string;
  year: string;
  image: string;
  alt: string;
  tagline: string;
  stack: string[];
  description: string;
  highlights: string[];
}

export interface ProjectPage {
  backToPortfolio: string;
  technologies: string;
  keyHighlights: string;
  interestedInSimilar: string;
  ctaDescription: string;
  contactUs: string;
  viewMoreProjects: string;
  viewMore: string;
}

export interface Portfolio {
  eyebrow: string;
  title: string;
  description: string;
  controls: {
    previous: string;
    next: string;
  };
  filters: {
    all: string;
    [key: string]: string;
  };
  projectPage: ProjectPage;
  projects: Project[];
}
