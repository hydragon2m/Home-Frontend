import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative h-12 w-auto flex items-center", className)}>
      {/* Light Mode Logo (light-logo.svg) */}
      <img
        src="/light-logo.svg"
        alt="Logo Light"
        className="block dark:hidden h-full w-auto object-contain transition-transform hover:scale-105"
      />
      {/* Dark Mode Logo (logo-dart.svg) */}
      <img
        src="/logo-dart.svg"
        alt="Logo Dark"
        className="hidden dark:block h-full w-auto object-contain transition-transform hover:scale-105"
      />
    </div>
  )
}
