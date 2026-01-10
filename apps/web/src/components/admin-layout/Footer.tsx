import { Github, Instagram, Linkedin, X } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="sticky bottom-0 z-10 mt-auto w-full overflow-hidden border-t border-base-300 bg-base-100">
      <div className="flex w-full justify-end px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/upcraftcrew"
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="size-4.5 text-orange-500 hover:text-orange-600 transition-colors duration-300" />
          </Link>
          <Link
            href="https://x.com/upcraftcrew"
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="X"
            target="_blank"
            rel="noopener noreferrer"
          >
            <X className="size-4.5 text-orange-500 hover:text-orange-600 transition-colors duration-300" />
          </Link>
          <Link
            href="https://linkedin.com/in/upcraftcrew"
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="size-4.5 text-orange-500 hover:text-orange-600 transition-colors duration-300" />
          </Link>
          <Link
            href="https://instagram.com/upcraftcrew"
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="size-4.5 text-orange-500 hover:text-orange-600 transition-colors duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};
