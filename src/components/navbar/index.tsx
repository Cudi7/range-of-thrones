import Link from "next/link";
import { AppNavLinks } from "@/components/navbar/app-nav-links";

export function Navbar() {
  return (
    <nav className="container mx-auto flex justify-between pt-6 text-sm font-semibold leading-6 text-slate-200 lg:pt-8">
      <Link href={"/"} className="text-xl font-bold">
        Range <span className="text-[hsl(240,100%,80%)]"> of</span> Thrones{" "}
      </Link>
      <div className="flex items-center">
        <div className="hidden items-center md:flex">
          <ul className="flex items-center gap-x-8">
            <AppNavLinks />
            <li>
              <a
                className="hover:text-indigo-400"
                href="https://github.com/Cudi7/AWS-Cloud-Practitioner-Certification-Prep"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AWS Project on GitHub"
              >
                AWS Project
              </a>
            </li>
            <li>
              <a
                className="hover:text-indigo-400"
                href="https://blog-cudi7.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Personal Blog"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                className="hover:text-indigo-400"
                href="mailto:codinaroger2@gmail.com"
                aria-label="mail contact"
              >
                Hire me! 😁
              </a>
            </li>
          </ul>
          <a
            href="https://github.com/Cudi7"
            className="ml-6 block text-slate-400 hover:text-slate-300"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <span className="sr-only">My GitHub Projects</span>
            <svg
              viewBox="0 0 16 16"
              className="size-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
