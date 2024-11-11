import Link from 'next/link';

export default function ProjectsNavigation() {
  return (
    // TODO: hover olmanyanlar için opacity eklenecek
    <div className="flex flex-row  justify-center mb-8 mt-8  space-x-8  sm:space-x-32">
      <Link className="text-white text-[12px] font-effra uppercase tracking-6" href="/projects">
        Back
      </Link>
      <Link className="text-white text-[12px] font-effra uppercase tracking-6" href="/">
        Home
      </Link>
      <Link className="text-white text-[12px] font-effra uppercase tracking-6" href="/projects">
        Next
      </Link>
    </div>
  );
}
