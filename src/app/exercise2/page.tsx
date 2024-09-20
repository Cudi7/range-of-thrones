import { FixedRange } from "@/components/range/fixed-range";
import { getFixedRangeData } from "@/lib/data/range";

export default async function Exercice2Page() {
  const data = await getFixedRangeData();

  return (
    <section className="relative mx-4 max-w-3xl space-y-16 sm:mx-0">
      <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-[4rem]">
        Exercise 2
      </h2>
      <FixedRange data={data} />
    </section>
  );
}
