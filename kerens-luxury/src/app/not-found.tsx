import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 pt-32 text-center">
      <p className="latin text-[6rem] leading-none text-sand">404</p>
      <h1 className="display mt-4 text-4xl">הפריט הזה כבר מצא בית חדש</h1>
      <p className="mt-3 max-w-md text-mocha">או שהעמוד לא קיים. בואי נחזור לבוטיק — יש עוד הרבה לגלות.</p>
      <Link href="/collection" className="btn-primary mt-10">לקולקציה</Link>
    </section>
  );
}
