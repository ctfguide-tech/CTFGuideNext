import Link from 'next/link';
import clsx from 'clsx';

const baseStyles = {
  solid:
    'group inline-flex items-center justify-center  py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
  outline:
    'group inline-flex ring-1 items-center justify-center  py-2 px-4 text-sm focus:outline-none',
};

const variantStyles = {
  solid: {
    blue:
      'bg-blue-900 text-white hover:bg-blue-700 hover:text-blue-100 active:bg-blue-800 active:text-blue-300 focus-visible:outline-blue-900',
    blue: 'rounded-sm bg-blue-600 text-white hover:text-blue-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600',
    white:
      'bg-white text-blue-900 hover:bg-blue-50 active:bg-blue-200 active:text-blue-600 focus-visible:outline-white',
  },
  outline: {
    blue:
      'ring-blue-200 text-blue-700 hover:text-blue-900 hover:ring-blue-300 active:bg-blue-100 active:text-blue-600 focus-visible:outline-blue-600 focus-visible:ring-blue-300',
    white:
      'ring-blue-700 text-white hover:ring-blue-500 active:ring-blue-700 active:text-blue-400 focus-visible:outline-white',
  },
};

export function Button({
  variant = 'solid',
  color = 'blue',
  className,
  href,
  ...props
}) {
  className = clsx(
    baseStyles[variant],
    variantStyles[variant][color],
    className
  );

  return href ? (
    <Link href={href} className={className} {...props} legacyBehavior />
  ) : (
    <button className={className} {...props} />
  );
}
