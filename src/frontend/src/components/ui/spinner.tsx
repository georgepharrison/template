import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

function FullPageSpinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

export { Spinner, FullPageSpinner };
