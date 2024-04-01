/**
 * @param props {import("react").HTMLAttributes<HTMLDivElement>}
 */
export function CardDecorator({ className, ...props }) {

  console.log(className)
  return (
    <div {...props} className={`card-decorator ${className}`}></div>
  );
}
