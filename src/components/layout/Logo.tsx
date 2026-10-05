import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" aria-label="Armtronix home" onClick={onClick} className={cn("relative block shrink-0", className)}>
      <Image src="/brand/logo.webp" alt="Armtronix" width={360} height={79} priority className="h-auto w-[132px] lg:w-[148px]" />
    </Link>
  );
}
