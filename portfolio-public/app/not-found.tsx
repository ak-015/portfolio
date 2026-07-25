import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="mt-3 text-muted">This page doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 rounded-pill bg-grad-primary px-6 py-3 text-sm font-medium text-white">
        Back home
      </Link>
    </div>
  );
}
