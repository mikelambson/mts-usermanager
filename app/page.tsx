import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto,1fr,auto] items-start justify-items-center p-8 pb-16 sm:p-8 font-[family-name:var(--font-geist-sans)] gap-48">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          MTS User Manager
        </h1>
        <h1 className="text-2xl font-bold">
          Welcome to the User Management System
        </h1>
        <p>Manage users, companies, and system access from this interface.</p>
      </main>
      <footer className="mt-56 row-start-3 flex gap-6 flex-wrap items-center justify-center">
        footer
      </footer>
    </div>
  );
}
