import Link from "next/link";

type Props = {
  href: string;
  label: string;
};

export default function NavLink({ href, label }: Props) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-black/60 backdrop-blur px-4 py-3 shadow-lg text-sm text-slate-200 hover:bg-black/80 transition-colors"
    >
      {label}
    </Link>
  );
}
