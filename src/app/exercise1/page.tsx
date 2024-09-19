import { Range } from "@/components/range/index";
import { getNormalRangeData } from "@/lib/data/range-data";
import { rangeType } from "@/lib/types";

export default async function Exercice1Page() {
  const data = await getNormalRangeData();

  return (
    <section className="relative mx-4 max-w-3xl space-y-16 sm:mx-0">
      <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-[4rem]">
        Exercise 1
      </h2>
      <Range type={rangeType.NORMAL} data={data} />
    </section>
  );
}
