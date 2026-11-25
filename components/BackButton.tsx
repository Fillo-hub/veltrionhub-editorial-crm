import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  text: string;
  link: string;
}

const BackButton = ({ text, link }: BackButtonProps) => {
  return (
    <Link
      href={link}
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4 group"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors">
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
      </span>
      {text}
    </Link>
  );
};

export default BackButton;
