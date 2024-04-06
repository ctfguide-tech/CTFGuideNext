/**
 * @param props {import("react").HTMLAttributes<HTMLDivElement> & {position?: 'top' | 'left'}}
 */
export function CardDecorator({ className = '', position = 'top', ...props }) {
  const getCardStyle = (pos) => {
    if (pos == 'top') {
      return 'card-decorator-top';
    } else if (pos == 'left') {
      return 'card-decorator-left';
    } else {
      console.error('Invalid card position.')
    }
  }
  return (
    <div {...props} className={`card-decorator ${getCardStyle(position)} ${className}`}></div>
  );
}
