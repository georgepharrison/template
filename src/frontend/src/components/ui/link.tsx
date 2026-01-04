import { Link as RouterLink, type LinkProps } from 'react-router';

export function Link({ viewTransition = true, ...props }: LinkProps) {
  return <RouterLink viewTransition={viewTransition} {...props} />;
}
