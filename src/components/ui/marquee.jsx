import { cn } from "@/lib/utils";

export const Marquee = ({
  className,
  pauseOnHover = false,
  reverse = false,
  children,
}) => {
  return (
    <div
      className={cn(
        "group flex overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "animate-marquee flex min-w-full shrink-0 items-center justify-around gap-4",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          reverse && "animate-marquee-reverse"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "animate-marquee flex min-w-full shrink-0 items-center justify-around gap-4",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          reverse && "animate-marquee-reverse"
        )}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}; 