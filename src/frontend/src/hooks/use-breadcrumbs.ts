import { useMatches } from 'react-router';

interface BreadcrumbHandle {
  breadcrumb: string;
}

interface BreadcrumbItem {
  path: string;
  label: string;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const matches = useMatches();

  return matches
    .filter((match): match is typeof match & { handle: BreadcrumbHandle } =>
      Boolean(
        match.handle &&
        typeof (match.handle as BreadcrumbHandle).breadcrumb === 'string'
      )
    )
    .map((match) => ({
      path: match.pathname,
      label: match.handle.breadcrumb,
    }));
}
