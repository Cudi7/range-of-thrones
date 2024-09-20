import { NormalRange } from "@/components/range/normal-range";
import { getNormalRangeData } from "@/lib/data/range";

export default async function Exercice1Page() {
  const data = await getNormalRangeData();

  return (
    <section className="relative mx-4 max-w-3xl space-y-16 sm:mx-0">
      <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-[4rem]">
        Exercise 1
      </h2>
      <NormalRange data={data} />
    </section>
  );
}
