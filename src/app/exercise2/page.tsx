import { Range2 } from "@/components/range/range2";
import { getFixedRangeData } from "@/lib/data/range-data";
import { rangeType } from "@/lib/types";

export default async function Exercice2Page() {
  const data = await getFixedRangeData();

  return (
    <section className="relative mx-4 max-w-3xl space-y-16 sm:mx-0">
      <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-[4rem]">
        Exercise 2
      </h2>
      <Range2 type={rangeType.FIXED} data={data} />
    </section>
  );
}
