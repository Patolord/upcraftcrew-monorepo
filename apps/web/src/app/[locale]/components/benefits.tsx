"use client";

import { motion, type Variants } from "motion/react";

import { SECTION_IDS } from "@/app/[locale]/constants";
import { useLandingI18n } from "@/app/[locale]/providers/landing-i18n-provider";
import {
  SparklesIcon,
  RocketIcon,
  UsersIcon,
  LayoutIcon,
  CalendarIcon,
  FileTextIcon,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }, // Stagger each feature
  },
};

const featureVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.8 },
  },
};

export const Benefits = () => {
  const { messages } = useLandingI18n();
  const { benefits } = messages;
  const iconClasses = [
    { iconClass: "bg-green-600/10 text-green-600", icon: SparklesIcon },
    {
      iconClass: "bg-yellow-600/10 text-yellow-600",
      icon: RocketIcon,
    },
    {
      iconClass: "bg-red-600/10 text-red-600",
      icon: UsersIcon,
    },
    {
      iconClass: "bg-gray-600/10 text-gray-600",
      icon: LayoutIcon,
    },
    {
      iconClass: "bg-blue-600/10 text-blue-600",
      icon: CalendarIcon,
    },
    {
      iconClass: "bg-gray-600/10 text-gray-600",
      icon: FileTextIcon,
    },
  ] as const;

  return (
    <div
      className="group bg-muted/25 container scroll-mt-12 rounded-2xl py-8 md:py-12 lg:py-12 2xl:py-28 pb-0"
      id={SECTION_IDS.benefits}
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 2xl:gap-12">
        <div>
          <div className="flex items-center gap-1.5 max-lg:justify-center">
            <div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-hover:bg-orange-500" />
            <p className="text-muted-foreground group-hover:text-primary font-mono text-sm font-medium transition-all">
              {benefits.eyebrow}
            </p>
            <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-hover:bg-orange-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold max-lg:text-center sm:text-3xl">
            {benefits.title}
          </p>
          <div className="mt-2 flex max-lg:justify-center max-lg:text-center">
            <p className="text-muted-foreground max-w-lg">{benefits.description}</p>
          </div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={containerVariants}
          className="grid h-fit gap-6 sm:grid-cols-2"
        >
          {benefits.items.map((item, index) => {
            const { icon: Icon, iconClass } = iconClasses[index] ?? iconClasses[0];
            return (
              <motion.div
                variants={featureVariants}
                className="rounded-lg border bg-card p-4 shadow"
                key={item.title}
              >
                <div className={`rounded-lg w-fit p-1.5 ${iconClass}`}>
                  <Icon className="size-5" />
                </div>
                <p className="mt-2 font-medium">{item.title}</p>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
