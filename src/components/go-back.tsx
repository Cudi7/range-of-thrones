import Link from "next/link";

export function GoBack() {
  return (
    <aside className="text-md absolute -top-36 left-0 font-medium">
      <Link href={"/"} className="transition-colors hover:text-white/80">
        &larr; Go back
      </Link>
    </aside>
  );
}
