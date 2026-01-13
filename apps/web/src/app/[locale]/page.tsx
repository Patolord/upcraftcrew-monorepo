import { Suspense } from "react";

import { Benefits } from "./components/benefits";
import { Features } from "./components/features";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
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
      <Suspense fallback={<div />}>
        <Portfolio />
      </Suspense>
      <Features />
      <Process />
      <Benefits />
      <Suspense fallback={<div />}>
        <Pricing />
      </Suspense>
      <Footer />
    </>
  );
};

export default LandingPage;
