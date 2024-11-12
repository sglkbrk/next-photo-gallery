import Link from 'next/link';

interface Props {
  slugs: string[];
  slug: string;
}
export default function ProjectsNavigation({ slugs, slug }: Props) {
  const inx = slugs.indexOf(slug);
  return (
    // TODO: hover olmanyanlar için opacity eklenecek
    <div className="flex flex-row  justify-center mb-8 mt-8  space-x-8  sm:space-x-32">
      <Link className="text-white text-[12px] font-effra uppercase tracking-6" href={slugs[inx - 1]}>
        Back
      </Link>
      <Link className="text-white text-[12px] font-effra uppercase tracking-6" href="/">
        Home
      </Link>
      <Link className="text-white text-[12px] font-effra uppercase tracking-6" href={slugs[inx + 1]}>
        Next
      </Link>
    </div>
  );
}
