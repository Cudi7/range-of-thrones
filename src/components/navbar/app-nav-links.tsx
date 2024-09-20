"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export function AppNavLinks() {
  const segment = useSelectedLayoutSegment();

  if (segment === null) return null;

  return (
    <>
      <li>
        <Link
          className={`hover:text-indigo-400 ${segment === "exercise1" ? "text-indigo-400" : ""}`}
          href="/exercise1"
        >
          Exercise 1
        </Link>
      </li>
      <li>
        <Link
          href="exercise2"
          className={`hover:text-indigo-400 ${segment === "exercise2" ? "text-indigo-400" : ""}`}
        >
          Exercise 2
        </Link>
      </li>
    </>
  );
}
