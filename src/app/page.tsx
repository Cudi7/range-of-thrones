import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Range <span className="text-[hsl(240,100%,80%)]">of</span> Thrones
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-gray-800/70 p-4 text-white hover:bg-gray-800/90"
          href="/exercise1"
        >
          <h3 className="text-2xl font-bold">Exercise 1</h3>
          <div className="text-lg">Normal range from min to max number.</div>
        </Link>
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-gray-800/70 p-4 text-white hover:bg-gray-800/90"
          href="/exercise2"
        >
          <h3 className="text-2xl font-bold">Exercise 2</h3>
          <div className="text-lg">Fixed number of options range</div>
        </Link>
      </div>
    </div>
  );
}
