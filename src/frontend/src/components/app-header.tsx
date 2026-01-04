import { AppBreadcrumbs } from './app-breadcrumbs';
import { ThemeToggle } from './theme-toggle';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

export function AppHeader() {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 rounded-t-2xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center gap-2 pl-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 hidden md:block" />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
        <AppBreadcrumbs />
      </div>
      <div className="absolute right-0 pr-4">
        <ThemeToggle size={'lg'} />
      </div>
    </header>
  );
}
