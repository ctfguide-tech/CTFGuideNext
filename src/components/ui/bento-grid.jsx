import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  className,
  Icon,
  name,
  description,
  header,
  href,
  cta,
  background,
}) => {
  return (
    <div
      className={cn(
        "group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 rounded-xl border border-transparent justify-between flex flex-col space-y-4 relative overflow-hidden",
        className
      )}
    >
      {background}
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 dark:text-neutral-200" />}
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">{name}</h3>
        </div>
        {description && (
          <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm">
            {description}
          </p>
        )}
      </div>
      {cta && href && (
        <div className="relative z-10">
          <a
            className="text-sm font-medium dark:text-neutral-200 group-hover/bento:underline"
            href={href}
          >
            {cta}
          </a>
        </div>
      )}
    </div>
  );
}; 