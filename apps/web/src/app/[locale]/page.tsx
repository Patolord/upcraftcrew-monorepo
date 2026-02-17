import { Suspense } from "react";

import { Benefits } from "./components/benefits";
import { CaseStudies } from "./components/case-studies";
import { Features } from "./components/features";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
import { Newsletter } from "./components/newsletter";
import { Portfolio } from "./components/portfolio";
import { Pricing } from "./components/pricing";
import { Process } from "./components/process";
import { Topbar } from "./components/top-bar";

const LandingPage = () => {
  return (
    <>
      <Suspense fallback={<div className="h-20" />}>
        <Topbar />
      </Suspense>
      <Hero />
      <Features />
      <Process />
      <Suspense fallback={<div />}>
        <CaseStudies />
      </Suspense>
      <Benefits />
      <Suspense fallback={<div />}>
        <Pricing />
      </Suspense>
      <Newsletter />
      <Suspense fallback={<div />}>
        <Portfolio />
      </Suspense>
      <Footer />
    </>
  );
};

export default LandingPage;
