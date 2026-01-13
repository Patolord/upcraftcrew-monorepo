"use client";

import { motion, type Variants } from "motion/react";

import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: (i) => ({
    opacity: 0,
    x: i % 3 === 0 ? -50 : i % 3 === 2 ? 50 : 0,
    y: 50,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.8 },
  },
};

export const Integrations = () => {
  const { messages } = useLandingI18n();
  const { integrations } = messages;

  return (
    <div
      className="group/section container overflow-hidden py-8 md:py-12 lg:py-16 2xl:py-28"
      id={SECTION_IDS.integrations}
    >
      <div className="flex items-center justify-center gap-1.5">
        <div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
        <p className="text-base-content/60 group-hover/section:text-primary font-mono text-sm font-medium transition-all">
          {integrations.eyebrow}
        </p>
        <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
      </div>
      <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">{integrations.title}</p>
      <div className="mt-2 flex justify-center text-center">
        <p className="text-base-content/80 max-w-lg">{integrations.description}</p>
      </div>
      <motion.div
        className="relative mt-8 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 lg:mt-16 xl:grid-cols-3 2xl:mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {integrations.items.map((item, index) => (
          <motion.div
            className="card group bg-base-100 relative cursor-pointer overflow-hidden p-6 shadow"
            custom={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            }}
            key={index}
          >
            <div className="flex justify-between">
              <img src={item.image} className="h-9" alt={item.image} />
              <span className="group-hover:text-base-content text-base-content/60 text-sm font-medium capitalize italic transition-all">
                {item.category}
              </span>
            </div>
            <p className="mt-3 text-lg font-medium">{item.title}</p>
            <p className="text-base-content/80 line-clamp-2 text-sm">{item.description}</p>
            <img
              src={item.image}
              className="absolute -end-2 -bottom-2 h-20 opacity-5 grayscale transition-all duration-300 group-hover:opacity-25 group-hover:grayscale-25"
              alt={item.image}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
