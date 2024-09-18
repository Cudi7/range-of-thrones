import { GoBack } from "@/components/go-back";
import { Range } from "@/components/range";
import Link from "next/link";

export default function Exercice1Page() {
  return (
    <section className="relative mx-4 max-w-3xl space-y-16 sm:mx-0">
      {/* <aside className="text-md absolute -top-36 right-0 font-medium">
        <Link
          href={"/exercice2"}
          className="transition-colors hover:text-white/80"
        >
          Next Exercice &rarr;
        </Link>
      </aside> */}
      <GoBack />

      <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-[4rem]">
        Exercice 1
      </h2>
      <Range type="normal" />
    </section>
  );
}
